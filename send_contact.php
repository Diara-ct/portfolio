<?php

use PHPMailer\PHPMailer\PHPMailer;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

require __DIR__ . '/vendor/autoload.php';

$mailConfig = require __DIR__ . '/config/mail_config.php';

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');
$trap    = trim($_POST['website'] ?? '');

if ($trap !== '') {                       // robot détecté
    header('Location: contact.html?contact=success');
    exit;
}

$allowedSubjects = ['Me contacter', 'Proposition de projet', 'Collaboration', 'Autre'];

if (
    $name === '' ||
    mb_strlen($name) > 100 ||
    preg_match('/[\r\n]/', $name . $email) ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    mb_strlen($email) > 254 ||
    !in_array($subject, $allowedSubjects, true) ||
    $message === '' ||
    mb_strlen($message) > 5000
) {
    header('Location: contact.html?contact=invalid');
    exit;
}

// 1) Sauvegarde en base (si elle est indisponible, on continue : le mail part quand même)
$pdo = null;
$messageId = null;
try {
    require __DIR__ . '/database.php';   // définit $pdo

    $stmt = $pdo->prepare(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$name, $email, $subject, $message]);
    $messageId = (int) $pdo->lastInsertId();
} catch (\Throwable $e) {
    error_log('Erreur base contact : ' . $e->getMessage());
}

// 2) Envoi du mail
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $mailConfig['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $mailConfig['username'];
    $mail->Password   = $mailConfig['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = (int) $mailConfig['port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($mailConfig['username'], 'Portfolio - Formulaire de contact');
    $mail->addAddress('hello.diaratoure@gmail.com');
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = '[Portfolio] ' . $subject;
    $mail->Body =
        "Nouveau message reçu depuis ton portfolio\n\n" .
        "Nom : " . $name . "\n" .
        "E-mail : " . $email . "\n" .
        "Sujet : " . $subject . "\n\n" .
        "Message :\n" . $message;

    $mail->send();

    // 3) Marque le message comme envoyé
    if ($pdo !== null && $messageId !== null) {
        try {
            $pdo->prepare('UPDATE contact_messages SET mail_sent = 1 WHERE id = ?')
                ->execute([$messageId]);
        } catch (\Throwable $e) {
            error_log('Erreur mise à jour contact : ' . $e->getMessage());
        }
    }

    header('Location: contact.html?contact=success');
    exit;

} catch (\Throwable $e) {
    error_log('Erreur formulaire Portfolio : ' . $e->getMessage());
    if (isset($mail) && $mail instanceof PHPMailer) {
        error_log('Détails PHPMailer : ' . $mail->ErrorInfo);
    }
    header('Location: contact.html?contact=error');
    exit;
}