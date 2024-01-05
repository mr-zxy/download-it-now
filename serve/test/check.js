const { execSync } = require('child_process');

try {
    execSync('openssl version');
    console.log(1)
} catch (e) {
    console.log(2)
}