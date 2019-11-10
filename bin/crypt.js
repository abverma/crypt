#!/usr/bin/env node

const handler = require('../lib/index.js')

let mode

if (process.argv[2]) {

	switch(process.argv[2]) {
		case '-e': mode = 'encrypt'
					handler.handleRequest(mode)
					break
		case '-d': mode = 'decrypt'
					handler.handleRequest(mode)
					break
		case '-l': mode = 'list'
					handler.handleListRequest()
					break
		case '-D': mode = 'delete'
					handler.handleDeleteRequest()
					break
		default: console.log('Unidentified options')
					break
	}	

} else {
	console.log('No operation option found') 
}