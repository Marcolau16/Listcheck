<?php
/**
 * Backend API ligero para persistencia de datos (JSON DB)
 * Funciona de manera plug-and-play con el servidor local de PHP o en cualquier hosting.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataDir = __DIR__ . '/data';
$dbFile = $dataDir . '/db.json';

// Asegurar existencia de carpeta y archivo de datos
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

function getDatabase($dbFile) {
    if (file_exists($dbFile)) {
        $content = file_get_contents($dbFile);
        $data = json_decode($content, true);
        if ($data) return $data;
    }
    return null;
}

function saveDatabase($dbFile, $data) {
    file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'ping':
        echo json_encode(['status' => 'ok', 'time' => time(), 'server' => 'PHP ' . phpversion()]);
        break;

    case 'get_all':
        $db = getDatabase($dbFile);
        echo json_encode(['status' => 'ok', 'data' => $db]);
        break;

    case 'save_all':
        if ($input) {
            saveDatabase($dbFile, $input);
            echo json_encode(['status' => 'ok', 'message' => 'Base de datos sincronizada']);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Datos inválidos']);
        }
        break;

    case 'save_appointment':
        if ($input && !empty($input['id'])) {
            $db = getDatabase($dbFile);
            if (!$db) $db = ['appointments' => []];
            if (!isset($db['appointments'])) $db['appointments'] = [];
            
            // Auto-agendamiento automático confirmado
            if (empty($input['status'])) {
                $input['status'] = 'confirmada';
            }
            
            array_unshift($db['appointments'], $input);
            saveDatabase($dbFile, $db);

            // Log / Opcional: notificación a la dueña
            echo json_encode(['status' => 'ok', 'appointment' => $input, 'notified' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Cita inválida']);
        }
        break;

    case 'save_specialist':
        if ($input && !empty($input['id'])) {
            $db = getDatabase($dbFile);
            if (!$db) $db = [];
            if (!isset($db['specialists'])) $db['specialists'] = [];

            $found = false;
            foreach ($db['specialists'] as &$spec) {
                if ($spec['id'] === $input['id']) {
                    $spec = array_merge($spec, $input);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $db['specialists'][] = $input;
            }
            saveDatabase($dbFile, $db);
            echo json_encode(['status' => 'ok', 'specialist' => $input]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    case 'delete_specialist':
        if ($input && !empty($input['id']) && $input['id'] !== 'any') {
            $db = getDatabase($dbFile);
            if ($db && isset($db['specialists'])) {
                $db['specialists'] = array_values(array_filter($db['specialists'], function($s) use ($input) {
                    return $s['id'] !== $input['id'];
                }));
                saveDatabase($dbFile, $db);
                echo json_encode(['status' => 'ok']);
                exit();
            }
            echo json_encode(['status' => 'error', 'message' => 'No encontrado']);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    case 'save_specialists':
        if (is_array($input)) {
            $db = getDatabase($dbFile);
            if (!$db) $db = [];
            $db['specialists'] = $input;
            saveDatabase($dbFile, $db);
            echo json_encode(['status' => 'ok', 'specialists' => $input]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    case 'save_services':
        if (is_array($input)) {
            $db = getDatabase($dbFile);
            if (!$db) $db = [];
            $db['services'] = $input;
            saveDatabase($dbFile, $db);
            echo json_encode(['status' => 'ok', 'services' => $input]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    case 'save_schedule':
        if ($input) {
            $db = getDatabase($dbFile);
            if (!$db) $db = [];
            $db['schedule'] = $input;
            saveDatabase($dbFile, $db);
            echo json_encode(['status' => 'ok', 'schedule' => $input]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    case 'update_appointment_status':
        if ($input && !empty($input['id']) && !empty($input['status'])) {
            $db = getDatabase($dbFile);
            if ($db && isset($db['appointments'])) {
                foreach ($db['appointments'] as &$appt) {
                    if ($appt['id'] === $input['id']) {
                        $appt['status'] = $input['status'];
                        break;
                    }
                }
                saveDatabase($dbFile, $db);
                echo json_encode(['status' => 'ok']);
                exit();
            }
            echo json_encode(['status' => 'error', 'message' => 'No encontrado']);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    case 'add_review':
        if ($input && !empty($input['author'])) {
            $db = getDatabase($dbFile);
            if (!$db) $db = [];
            if (!isset($db['reviews'])) $db['reviews'] = [];
            array_unshift($db['reviews'], $input);
            saveDatabase($dbFile, $db);
            echo json_encode(['status' => 'ok', 'review' => $input]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    case 'update_business':
        if ($input) {
            $db = getDatabase($dbFile);
            if (!$db) $db = [];
            if (!isset($db['business'])) $db['business'] = [];
            $db['business'] = array_merge($db['business'], $input);
            saveDatabase($dbFile, $db);
            echo json_encode(['status' => 'ok', 'business' => $db['business']]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error']);
        }
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Acción no especificada']);
        break;
}
