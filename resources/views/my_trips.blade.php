
<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
    @vite(['resources/js/my_trip.jsx'])
</head>
<body>
    <script>
        window.userToken = @json($token);
    </script>
    <div id="my_trips"></div>
</body>
</html>
