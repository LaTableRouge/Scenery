<?php
require_once './includes/common/variables.inc.php';
require_once './includes/common/vite.inc.php';
$vite = new Vite();
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

    <title>The Scenery</title>

    <?php $vite->enqueueScript('src/scripts/app.js', true); ?>
</head>

<body>
    <main class="content-wrapper">

        <?php require_once './includes/components/canvas.php'; ?>
        <?php
            if (!isset($_GET['no-controls'])) {
                require_once './includes/components/config.php';
            }
?>

    </main>
</body>

</html>
