<x-guest-layout>
    <div class="flex flex-col justify-center items-center min-h-screen px-4 bg-[#fecb00]">
        <!-- Title -->
        <h1 class="text-5xl md:text-5xl font-extrabold text-white mb-8 text-center">
            Register
        </h1>

        <!-- Card Register สีขาวตรงกลาง -->
        <x-authentication-card class="w-full max-w-xl bg-white rounded-3xl p-6 md:p-12 shadow-lg flex flex-col space-y-6">
            <x-validation-errors class="mb-4" />

            @session('status')
                <div class="mb-4 font-medium text-lg text-green-600 text-center">
                    {{ $value }}
                </div>
            @endsession

            <form method="POST" action="{{ route('register') }}" class="space-y-6 w-full">
                @csrf

                <!-- Name -->
                <div>
                    <x-label for="name" value="{{ __('Name') }}" class="text-xl font-semibold text-slate-800" />
                    <x-input id="name" class="block mt-2 w-full rounded-2xl border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-lg"
                             type="text" name="name" :value="old('name')" required autofocus autocomplete="name" />
                </div>

                <!-- Email -->
                <div>
                    <x-label for="email" value="{{ __('Email') }}" class="text-xl font-semibold text-slate-800" />
                    <x-input id="email" class="block mt-2 w-full rounded-2xl border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-lg"
                             type="email" name="email" :value="old('email')" required autocomplete="username" />
                </div>

                <!-- Password -->
                <div>
                    <x-label for="password" value="{{ __('Password') }}" class="text-xl font-semibold text-slate-800" />
                    <x-input id="password" class="block mt-2 w-full rounded-2xl border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-lg"
                             type="password" name="password" required autocomplete="new-password" />
                </div>

                <!-- Confirm Password -->
                <div>
                    <x-label for="password_confirmation" value="{{ __('Confirm Password') }}" class="text-xl font-semibold text-slate-800" />
                    <x-input id="password_confirmation" class="block mt-2 w-full rounded-2xl border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-lg"
                             type="password" name="password_confirmation" required autocomplete="new-password" />
                </div>

                <!-- Terms & Privacy Policy -->
                @if (Laravel\Jetstream\Jetstream::hasTermsAndPrivacyPolicyFeature())
                    <div class="flex items-center mt-2">
                        <x-checkbox name="terms" id="terms" class="rounded text-yellow-600 focus:ring-yellow-500" required />
                        <div class="ms-2 text-base text-gray-700">
                            {!! __('I agree to the :terms_of_service and :privacy_policy', [
                                'terms_of_service' => '<a target="_blank" href="'.route('terms.show').'" class="underline text-gray-600 hover:text-gray-900">'.__('Terms of Service').'</a>',
                                'privacy_policy' => '<a target="_blank" href="'.route('policy.show').'" class="underline text-gray-600 hover:text-gray-900">'.__('Privacy Policy').'</a>',
                            ]) !!}
                        </div>
                    </div>
                @endif

                <!-- Buttons -->
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 w-full">
                    <a class="text-base text-gray-600 hover:text-gray-900 underline"
                       href="{{ route('login') }}">
                        {{ __('Already registered?') }}
                    </a>

                    <x-button class="px-8 py-4 rounded-2xl bg-yellow-400 text-[#7f4534] text-xl font-bold shadow hover:bg-yellow-500 transition transform hover:scale-105">
                        {{ __('Register') }}
                    </x-button>
                </div>
            </form>
        </x-authentication-card>
    </div>
</x-guest-layout>
