<?php
// Newsletter signup handler for Hostinger (PHP mail()).
// Set $to to the inbox that should receive signups.
$to = 'hello@iamniravmehta.com';

header('Content-Type: application/json; charset=utf-8');

function respond($code, $message) {
    http_response_code($code);
    echo json_encode(['message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, 'Method not allowed.');

// Honeypot: bots fill hidden fields
if (!empty($_POST['website'])) respond(200, 'Thanks for subscribing!');

$name  = trim(strip_tags($_POST['name'] ?? ''));
$email = trim($_POST['email'] ?? '');

if ($name === '' || mb_strlen($name) > 120) respond(422, 'Please enter your full name.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, 'Please enter a valid email address.');

$name = str_replace(["\r", "\n"], ' ', $name);
$host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');

$subject = 'New newsletter signup';
$body    = "Name: $name\nEmail: $email\nDate: " . date('c') . "\n";
$headers = "From: Website <no-reply@$host>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8\r\n";

if (@mail($to, $subject, $body, $headers)) respond(200, 'Thanks for subscribing!');
respond(500, 'Could not subscribe right now. Please try again later.');
