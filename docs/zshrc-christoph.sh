mac-update() {
echo -e $fg[green] "Updating macOS..." ${fg[white]}
sudo softwareupdate -i -a;

echo -e $fg[green] "Updating App Store apps..." ${fg[white]}
mas upgrade;

echo -e $fg[green] "Updating Homebrew and its installed packages..." ${fg[white]}
brew update; brew upgrade; brew upgrade --cask; brew cleanup;

echo -e $fg[green] "Update global npm" ${fg[white]}
npm install npm -g; npm update -g;

#echo -e $fg[green] "Update global nuget" ${fg[white]}
#dotnet tool list -g | awk '{ print $1 }' | tail +3 | xargs -I % sh -c 'dotnet tool update -g %;'

echo -e $fg[green] "Update gem" ${fg[white]}
gem update; gem cleanup;

echo -e $fg[green] "Upgrade bun" ${fg[white]}
bun upgrade

echo -e $fg[green] "Upgrade zsh" ${fg[white]}
omz update
}

mac-update-apps() {
echo -e $fg[green] "Updating App Store apps..." ${fg[white]}
mas upgrade;

echo "Upgrading Google Chrome..."
brew upgrade --cask google-chrome || true

echo "Upgrading Firefox..."
brew upgrade --cask firefox || true

echo "Upgrading Docker Desktop..."
brew upgrade --cask docker-desktop || true

echo "Upgrading Cursor..."
brew upgrade --cask cursor || true

echo "Upgrading Figma..."
brew upgrade --cask figma || true

echo "Upgrading Fork..."
brew upgrade --cask fork || true

echo "Upgrading VS Code..."
brew upgrade --cask visual-studio-code || true

echo "Upgrading Microsoft Teams..."
brew upgrade --cask microsoft-teams || true

echo "Upgrading Whatsapp..."
brew upgrade --cask whatsapp || true
}

plugins=(git colored-man-pages colorize yarn kubectl docker docker-compose)
source $ZSH/oh-my-zsh.sh
bindkey '^X' create_completion

if [ -d "/opt/homebrew/opt/ruby/bin" ]; then
export PATH=/opt/homebrew/opt/ruby/bin:$PATH
  export PATH=`gem environment gemdir 2>/dev/null`/bin:$PATH
export GEM_OPTS="--no-document"
fi
