<?php
$arraySizeLimit = 100;
$fileName = "scores.csv";

if (isset($_GET["name"]) && isset($_GET["score"])) {
	$global_name = parseString((string)htmlspecialchars($_GET["name"]));
	$global_score = (int)trimString($_GET["score"]);

	if ($global_name == ''|$global_name== 'null') {
		$global_name = 'Anonymous';
	}

	$scoreFile = fopen($fileName, "r") or die("{success: false}");
	$fileContents = fread($scoreFile, filesize($fileName));
	$CSVScores = explode("\n", $fileContents);

	for ($i = 0; $i < sizeof($CSVScores); $i++) {
		$scoreString = trimString($CSVScores[$i]);

		if (strlen($scoreString) > 0) {
			$splitArray = explode(",", $scoreString);
			$name = $splitArray[0];
			$score = $splitArray[1];

			if ((int)$score < $global_score) {
				$txt = generateNewString($global_score, $global_name, $fileContents, $CSVScores, $i, $arraySizeLimit);
				file_put_contents($fileName, $txt) or die('{"success": false}');
				echo '{"success": "true", "highscore": "true"}';
				fclose($scoreFile);
				exit();
			}
		}
	}
	echo '{"success": "true", "highscore": "false"}';
	fclose($scoreFile);
} else {
	$scoreFile = fopen($fileName, "r") or die('{"success": false}');
	$fileContents = fread($scoreFile, filesize($fileName));
	echo '{"success": "true", "scoresCSV":"' . str_replace("\n", "\\n", $fileContents) . '"}';
	fclose($scoreFile);
}

function generateNewString($score, $username, $fileContents, $array, $index, $arraySizeLimit) {
	array_splice($array, $index, 0, $username . "," . $score);
	$array = array_slice($array, 0, $arraySizeLimit);

	return join("\n", $array);
}

function trimString($string) {
	$string = preg_replace("/^(\s+)/", "", $string);
	$string = preg_replace("/(\s+)$/", "", $string);

	return $string;
}

function parseString($string) {
	$string = trimString($string);
	$string = str_replace(",", "", $string);

	return $string;
}
?>
