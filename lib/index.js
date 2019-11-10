const crypto = require('crypto'),
      fs = require('fs'),
      path = require('path'),
      Writable = require('stream').Writable
      readline = require('readline'),
      algorithm = 'aes-192-cbc',
      cipherFolder = path.join(__dirname, '../ciphers')

// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use async `crypto.scrypt()` instead.
// Use `crypto.randomBytes()` to generate a random iv instead of the static iv
// shown here.

let password, 
	file,
	mutableStdout = new Writable({
		write: function(chunk, encoding, callback) {
			if (!this.muted) {
			  	process.stdout.write(chunk, encoding)
			} 
			callback()
		}
	})

mutableStdout.muted = false

const iv = Buffer.alloc(16, 0), // Initialization vector.
	rl = readline.createInterface({
		input: process.stdin,
		output: mutableStdout,
		terminal: true
	})

const getEntity = (rl, mode) => {
	return new Promise((resolve, reject) => {
		rl.question(`Which password do you want to ${mode}? `, (answer) => {
			return resolve(answer)
		})
	})
}

const getEncryptionPassword = async (rl, mode) => {
	return new Promise((resolve, reject) => {
		rl.question(`Enter passphrase for ${mode}ion: `, (answer) => {
			mutableStdout.muted = false
			console.log('\n...verifying')
			return resolve(answer)
		})
		mutableStdout.muted = true
	})
}

const getPassword = async (rl) => {
	return new Promise((resolve, reject) => {
		rl.question(`Enter password to be encrypted (this will be stored for recovery): `, (answer) => {
			mutableStdout.muted = false
			console.log('\n...encrypting')
			return resolve(answer)
		})
		mutableStdout.muted = true
	})
}

exports.handleRequest = (mode) => {
	getEntity(rl, mode)
	.then((answer) => {
		if (mode == 'encrypt') {
			file = answer
		} else {
			file = fs.readFileSync(cipherFolder + '/' + answer)
		}

		return getEncryptionPassword(rl, mode)
	})
	.then((answer) => {
		password = 'answer'
		if (mode == 'encrypt') {
			return getPassword(rl)
		} else {
			return Promise.resolve()
		}
	})
	.then((toEncrypt) => {
		const key = crypto.scryptSync(password, 'salt', 24)
		if (mode == 'encrypt') {
			const cipher = crypto.createCipheriv(algorithm, key, iv)
			encrypt(file, toEncrypt, cipher)
		} else {
			const decipher = crypto.createDecipheriv(algorithm, key, iv)
			decrypt(file, decipher)
		}
		
		rl.close()
	})
	.catch((ex) => {
		console.log(ex)
	})

}

const encrypt = (file, text, cipher) => {
	let encrypted = ''
	cipher.on('readable', () => {
		let chunk
	 	while (null !== (chunk = cipher.read())) {
			encrypted += chunk.toString('hex')
		}
	})
	cipher.on('end', () => {
		fs.writeFileSync(cipherFolder + '/' + file, encrypted, {
			encoding: 'hex'
		})
		console.log('\nPassword encrypted successfully!')
	})
	cipher.write(text)
	cipher.end()
}

const decrypt = (file, decipher) => {
	let decrypted = ''
	decipher.on('readable', () => {
	  while (null !== (chunk = decipher.read())) {
	    decrypted += chunk.toString('utf8')
	  }
	});
	decipher.on('end', () => {
	  console.log('Your password is: ' + decrypted)
	  // Prints: some clear text data
	});

	decipher.write(file)
	decipher.end()
}

