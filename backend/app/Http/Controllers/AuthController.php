<?php
namespace App\Http\Controllers;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
class AuthController extends Controller
{
/**
* Create a new AuthController instance.
*
* @return void
*/
/**
* Get a JWT via given credentials.
*
* @return \Illuminate\Http\JsonResponse
*/
public function login(Request $request)
{
$input = $request->only('email', 'password');
$jwt_token = null;
if (!$jwt_token = JWTAuth::attempt($input)) {
return response()->json([
'success' => false,
'message' => 'Invalid Email or Password',
], Response::HTTP_UNAUTHORIZED);
}
return response()->json([
'success' => true,
'token' => $jwt_token,
]);
}
/**
* Register a User.
*
* @return \Illuminate\Http\JsonResponse
*/
public function register(Request $request)
{
$validator = Validator::make($request->all(), [
'name' => 'required|string|between:2,100',
'email' => 'required|string|email|max:100|unique:users',
'password' => 'required|string|confirmed|min:6',
]);
if ($validator->fails()) {
return response()->json($validator->errors()->toJson(), 400);
}
$user = User::create(array_merge(
$validator->validated(),
['password' => bcrypt($request->password)]
));
return response()->json([
'message' => 'User successfully registered',
'user' => $user
], 201);
}
/**
* Log the user out (Invalidate the token).
*
* @return \Illuminate\Http\JsonResponse
*/
public function logout()
{
Auth::logout();
return response()->json([
'status' => 'success',
'msg' => 'Logged out Successfully.'
], 200);
}
/**
* Return auth guard
*/
private function guard()
{
return Auth::guard();
}
/**
* Refresh a token.
*
* @return \Illuminate\Http\JsonResponse
*/
public function refresh()
{
try {
$newToken = JWTAuth::refresh(JWTAuth::getToken());
return $this->createNewToken($newToken);
} catch (JWTException $e) {
return response()->json([
'status' => 'error',
'message' => 'Token refresh failed'
], 401);
}
}
/**
* Get the authenticated User.
*
* @return \Illuminate\Http\JsonResponse
*/
public function userProfile()
{
try {
$user = JWTAuth::parseToken()->authenticate();
return response()->json($user);
} catch (JWTException $e) {
return response()->json([
'status' => 'error',
'message' => 'User not found or token invalid'
], 404);
}
}
public function updateProfile(Request $request)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|email|max:100|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only('name', 'email'));

        return response()->json($user, 200);

    } catch (JWTException $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Token invalid or user not found'
        ], 401);
    }
}

/**
* Get the token array structure.
*
* @param string $token
*
* @return \Illuminate\Http\JsonResponse
*/
protected function createNewToken($token)
{
try {
$user = JWTAuth::setToken($token)->toUser();
return response()->json([
'access_token' => $token,
'token_type' => 'bearer',
'expires_in' => config('jwt.ttl') * 60, // Récupère la valeur depuis config
'user' => $user
]);
} catch (JWTException $e) {
return response()->json([
'access_token' => $token,
'token_type' => 'bearer',
'expires_in' => 60 * 60, // 1 heure par défaut
'user' => null
]);
}
}
}
