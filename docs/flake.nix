{
  description = "Jekyll wedding website development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Ruby environment with Jekyll
        rubyEnv = pkgs.ruby_3_3.withPackages
          (ps: with ps; [ jekyll jekyll-sitemap webrick ]);

      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ rubyEnv bundler bundix git ];

          shellHook = ''
            # Create serve alias
            alias serve='bundle exec jekyll serve'

            echo "Jekyll wedding website development environment"
            echo ""
            echo "Available commands:"
            echo "  serve              - Start local development server (alias for bundle exec jekyll serve)"
            echo "  jekyll serve       - Start local development server"
            echo "  jekyll build       - Build static site"
            echo "  bundle install     - Install Ruby dependencies"
            echo "  bundix            - Generate gemset.nix from Gemfile.lock"
            echo ""
            echo "Get started: bundle install && serve"
          '';
        };

        # Serve app for running the development server
        apps.serve = {
          type = "app";
          program = toString (pkgs.writeShellScript "serve" ''
            ${rubyEnv}/bin/bundle exec jekyll serve
          '');
        };

        apps.default = self.outputs.apps.${system}.serve;

        # Default package builds the site
        packages.default = pkgs.stdenv.mkDerivation {
          name = "wedding-site";
          src = ./.;

          buildInputs = [ rubyEnv ];

          buildPhase = ''
            jekyll build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r _site/* $out/
          '';
        };
      });
}
