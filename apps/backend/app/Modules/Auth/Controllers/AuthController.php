<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Services\AuthService;
use App\Modules\Auth\Services\EmailVerificationService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService) {}

    public function register(RegisterRequest $request)
    {
        return $this->authService->register($request->validated());
    }

    public function login(LoginRequest $request)
    {
        return $this->authService->login($request->validated());
    }

    public function me(Request $request)
    {
        return $this->authService->me($request->user());
    }

    public function logout(Request $request)
    {
        return $this->authService->logout($request->user());
    }

    public function sendVerificationCode( Request $request) {
        $request->validate([
            'email' => [ 'required', 'email',],
        ]);

        return $this->authService ->sendVerificationCode( $request->email);
    }

    public function verifyCode( Request $request) {
        $request->validate([
            'email' => [ 'required', 'email', ],
            'code' => [ 'required', 'string', ],
        ]);

        return $this->authService ->verifyCode( $request->email, $request->code );
    }
}