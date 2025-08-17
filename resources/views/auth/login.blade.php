<x-guest-layout>
    <div class="flex flex-col justify-center items-center min-h-screen px-4 bg-[#fecb00]">
        <!-- Logo วงกลม ขนาดใหญ่ -->
        <a href="/">
            <img src="{{ asset('images/logo1.png') }}" alt="Logo" class="w-56 h-56 object-cover rounded-full" />
        </a>

        <!-- Card Login สีขาว -->
        <x-authentication-card class="w-full max-w-xl bg-white rounded-3xl p-6 md:p-12 shadow-lg flex flex-col space-y-6 ">
            <x-validation-errors class="mb-4" />

            @session('status')
                <div class="mb-4 font-medium text-lg text-green-600 text-center">
                    {{ $value }}
                </div>
            @endsession

            <form method="POST" action="{{ route('login') }}" class="space-y-6 w-full">
                @csrf
                <!-- Email -->
                <div>
                    <x-label for="email" value="{{ __('Email') }}" class="text-xl font-semibold text-slate-800" />
                    <x-input id="email" class="block mt-2 w-full rounded-2xl border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-lg"
                             type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
                </div>

                <!-- Password -->
                <div>
                    <x-label for="password" value="{{ __('Password') }}" class="text-xl font-semibold text-slate-800" />
                    <x-input id="password" class="block mt-2 w-full rounded-2xl border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-lg"
                             type="password" name="password" required autocomplete="current-password" />
                </div>

                <!-- Remember me -->
                <div class="flex items-center mt-2">
                    <x-checkbox id="remember_me" name="remember" class="rounded text-yellow-600 focus:ring-yellow-500" />
                    <span class="ms-2 text-base text-gray-700">{{ __('Remember me') }}</span>
                </div>

                <!-- Buttons -->
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 w-full">
                    @if (Route::has('password.request'))
                        <a class="text-base text-gray-600 hover:text-gray-900 underline"
                           href="{{ route('password.request') }}">
                            {{ __('Forgot your password?') }}
                        </a>
                    @endif

                    <x-button class="px-8 py-4 rounded-2xl bg-yellow-400 text-[#7f4534] text-xl font-bold shadow hover:bg-yellow-500 transition transform hover:scale-105">
                        {{ __('Log in') }}
                    </x-button>
                </div>
            </form>
        </x-authentication-card>
    </div>
</x-guest-layout>
