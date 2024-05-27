echo "Building app..."
npm run build
echo "Deploy files to server..."
scp -r -i ~/Desktop/becode.vn dist/* root@143.198.214.247:/var/www/becode/
echo "Done!"