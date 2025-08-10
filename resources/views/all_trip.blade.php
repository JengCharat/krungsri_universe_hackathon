<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
    @vite(['resources/js/all_trip.jsx'])
</head>
<body>
    <script>
        window.userToken = @json($token);
    </script>
    <div id="all_trip"></div>
</body>
</html>
