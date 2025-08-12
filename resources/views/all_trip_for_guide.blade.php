
<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
    @vite(['resources/js/AllTripsForGuide.jsx'])
</head>
<body>
    <script>
        window.userToken = @json($token);
    </script>
    <div id="all_trip_for_guide"></div>
</body>
</html>
