<?php
require_once './assets/includes/common/variables.inc.php';
require_once './assets/includes/common/functions.inc.php';
$env = get_env()['env'];

require_once './assets/includes/common/vite.inc.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        http-equiv="X-UA-Compatible"
        content="IE=edge"
    >

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <?php require_once './assets/includes/components/og.inc.php'; ?>

    <title>Victor DIANA's scenery</title>

    <?php vite_enqueue_script('assets/js/app.js', true); ?>
</head>

<body>
    <main class="content-wrapper">

        <?php require_once './assets/includes/components/canvas.php'; ?>
        <?php
        if (!isset($_GET['no-controls'])) {
            require_once './assets/includes/components/config.php';
        }
?>

    </main>
</body>

</html>
