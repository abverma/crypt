# crypt
Command Line Password Manager

#Install - npm install crypt

#Usage

Encrypt - $ crypt -e (Follow command line questions)

$ crypt -e                                                                                                                        master
Which password do you want to encrypt? amazon
Enter passphrase for encryption:
...verifying
Enter password to be encrypted (this will be stored for recovery):
...encrypting

Password encrypted successfully!

Decrypt - $ crypt -d (Follow command line questions)

$ crypt -d                                                                                                                        master
Which password do you want to decrypt? amazon
Enter passphrase for decryption:
...verifying
Your password is: password
