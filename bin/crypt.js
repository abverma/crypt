#!/usr/bin/env node

const handler = require('../lib/index.js')

let mode

if (process.argv[2]) {

	switch(process.argv[2]) {
		case '-e': mode = 'encrypt'
				   break
		case '-d': mode = 'decrypt'
				   break
		default: console.log('Unidentified options')
				 return
	}

	handler.handleRequest(mode)

} else {
	return 
}
