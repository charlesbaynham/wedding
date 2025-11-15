{
  description = "Jekyll wedding website development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ ruby_3_2 bundler jekyll git ];

          shellHook = ''
            export GEM_HOME="$PWD/.gems"
            export PATH="$GEM_HOME/bin:$PATH"
            echo "Jekyll development environment loaded"
            echo "Run 'bundle install' to install gems"
            echo "Run 'bundle exec jekyll serve' to start the server"
          '';
        };
      });
}
