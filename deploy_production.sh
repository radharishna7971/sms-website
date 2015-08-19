 #!/bin/bash

echo COPYING CLIENT/SERVER FILES
scp -r client/ root@107.170.195.138:smstudios-app
scp -r server/ root@107.170.195.138:smstudios-app
echo TUNNELING
ssh -u'root' -p$SSH_PASS -h107.170.195.138 <<'ENDSSH'
export NODE_ENV=production
pm2 restart server
ENDSSH
echo COMPLETED
