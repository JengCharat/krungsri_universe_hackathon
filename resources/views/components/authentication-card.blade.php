<div {{ $attributes->merge(['class' => 'w-full bg-gradient-to-r from-blue-50 to-blue-75 rounded-3xl p-6 md:p-12 shadow-md flex flex-col space-y-6 mb-20']) }}>
    {{ $logo ?? '' }}
    {{ $slot }}
</div>
