<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set the timezone
date_default_timezone_set('UTC');

// Get the form data
$nom = isset($_POST['nom']) ? htmlspecialchars(trim($_POST['nom'])) : '';
$prenom = isset($_POST['prenom']) ? htmlspecialchars(trim($_POST['prenom'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$souhait = isset($_POST['souhait']) ? htmlspecialchars(trim($_POST['souhait'])) : '';
$precisions = isset($_POST['precisions']) ? htmlspecialchars(trim($_POST['precisions'])) : '';

// Validate required fields
$errors = [];

if (empty($nom)) {
    $errors['nom'] = 'Last name is required';
}

if (empty($prenom)) {
    $errors['prenom'] = 'First name is required';
}

if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (empty($souhait)) {
    $errors['souhait'] = 'Please select a wish';
} elseif ($souhait === 'autre' && empty($precisions)) {
    $errors['precisions'] = 'Please specify your wish';
}

// If there are errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation errors',
        'errors' => $errors
    ]);
    exit;
}

// Prepare the data to save or process
$wishData = [
    'nom' => $nom,
    'prenom' => $prenom,
    'email' => $email,
    'souhait' => $souhait,
    'precisions' => $precisions,
    'timestamp' => date('Y-m-d H:i:s')
];

// In a real application, you would:
// 1. Save to a database
// 2. Send an email notification
// 3. Maybe process the wish in some way

// For this example, we'll just log to a file and return success
$logMessage = sprintf(
    "[%s] New wish submitted: %s %s (%s) - Wish: %s%s\n",
    $wishData['timestamp'],
    $wishData['prenom'],
    $wishData['nom'],
    $wishData['email'],
    $wishData['souhait'],
    $wishData['precisions'] ? ' - Details: ' . $wishData['precisions'] : ''
);

// Log to a file (make sure the directory is writable)
file_put_contents('wish_submissions.log', $logMessage, FILE_APPEND);

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Your wish has been received!',
    'data' => $wishData
]);
?>