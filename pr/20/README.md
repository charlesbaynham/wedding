# Jekyll Wedding Website

A customizable Jekyll-based wedding website built with Bootstrap 3. This site provides a beautiful, responsive platform to share your wedding details, story, and information with guests.

## Features

- 📱 Responsive design with Bootstrap 3
- 🎨 Customizable via single YAML configuration file
- 📸 Photo galleries for wedding party and story
- 🗺️ Google Maps integration for venue locations
- 📅 Event schedule management
- 🏨 Hotel recommendations with booking links
- ❓ FAQ section
- 🌆 City guide for guests
- 📧 Email subscription modal

## Getting Started

### Using Nix Flake (Recommended)

This project uses Nix flakes for reproducible development environments.

```bash
# Enter the development environment
nix develop

# Install Ruby dependencies
bundle install

# Start the local development server
jekyll serve

# Open your browser to http://localhost:4000
```

The development shell provides:
- Ruby 3.3 with Jekyll, jekyll-sitemap, and webrick
- Bundler for dependency management
- Bundix for Nix integration
- Git for version control

### Without Nix

If you don't have Nix installed:

```bash
# Install Ruby 3.x (if not already installed)
# On macOS with Homebrew:
brew install ruby

# On Ubuntu/Debian:
sudo apt-get install ruby-full

# Install Bundler
gem install bundler

# Install dependencies
bundle install

# Start the development server
bundle exec jekyll serve

# Open your browser to http://localhost:4000
```

## Customization

### Primary Customization File

**`_config.yml`** is the heart of your wedding website. This single file contains all your wedding-specific data:

- Site metadata (title, description, URL)
- Event locations (ceremony, reception, etc.)
- Event schedule with dates, times, and details
- Hotel recommendations
- Wedding party information
- FAQ questions and answers
- City guide recommendations
- Google API keys for maps

### Step-by-Step Customization

1. **Update Basic Info** (`_config.yml`)
   ```yaml
   title: Your Names
   email: your.email@example.com
   url: https://yourwedding.example.com
   description: "We're getting married!"
   ```

2. **Define Your Venues**
   ```yaml
   locations:
     ceremony_venue: &ceremony_location
       location_name: Your Venue Name
       address1: 123 Main St
       address2: City, ST 12345
       coordinates: lat,long
       google_maps_url: https://www.google.com/maps/...
   ```

3. **Add Your Events**
   ```yaml
   events:
     - name: Wedding Ceremony
       date: Saturday, June 15, 2024
       time: 3:00 PM
       attire: Formal
       description: Join us as we exchange vows...
       <<: *ceremony_location
   ```

4. **Customize the Homepage** (`index.html`)
   - Update couple names in the header
   - Rewrite "Our Story" sections with your narrative
   - Replace placeholder photos in `img/ourstory/`

5. **Add Wedding Party** (`_config.yml` and images)
   - Add photos to `img/people/squares/` (square cropped)
   - Update `people.her_side` and `people.his_side` in config
   - Include names, roles, and descriptions

6. **Update Details Page** (`_includes/wedding_details.html`)
   - Customize transportation information
   - Add accommodation details
   - Update getting around section

7. **Replace Images**
   - Billboard headers: Update images and CSS in `css/main.css`
   - Wedding party: Add square photos to `img/people/squares/`
   - Story photos: Add to `img/ourstory/`

8. **Configure Google Maps**
   - Get API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps Static API and Maps Embed API
   - Add key to `_config.yml` under `google.key`

### Color Scheme

The default accent color is gold (`#AFA63D`). To change:

1. Open `css/main.css`
2. Search for `#AFA63D`
3. Replace with your chosen color

### Navigation

Edit `_includes/nav.html` to:
- Update couple initials in navbar brand
- Add/remove navigation items
- Change link text

## Project Structure

```
.
├── _config.yml          # Main configuration (CUSTOMIZE THIS!)
├── _layouts/            # Page templates
│   ├── default.html     # Base layout
│   └── info.html        # Info page layout with billboard
├── _includes/           # Reusable components
│   ├── nav.html         # Navigation bar
│   ├── wedding_details.html  # Details page content
│   └── ...
├── css/                 # Stylesheets
│   ├── main.css         # Custom styles
│   └── bootstrap.min.css
├── js/                  # JavaScript
├── img/                 # Images
│   ├── people/          # Wedding party photos
│   └── ourstory/        # Story section images
├── index.html           # Homepage
├── celebrations.html    # Events page
├── people.html          # Wedding party page
├── details.html         # Details page
├── faq.html            # FAQ page
├── guide.html          # City guide page
└── etc.html            # Registry/contact page
```

## Building for Production

```bash
# Build the static site
jekyll build

# Output will be in _site/ directory
```

## Deployment

### GitHub Pages

1. Push your repository to GitHub
2. Go to repository Settings > Pages
3. Set source to your main branch
4. Your site will be available at `https://username.github.io/repository-name/`

### Custom Domain

1. Add a `CNAME` file with your domain name
2. Configure DNS with your domain provider
3. Add domain in GitHub Pages settings

### Other Hosting

The `_site/` directory contains static HTML/CSS/JS that can be hosted anywhere:
- Netlify
- Vercel  
- AWS S3
- Any static hosting provider

## Technologies Used

- **Jekyll 3.9.x** - Static site generator
- **Bootstrap 3.3.2** - Responsive CSS framework
- **jQuery 1.11.1** - JavaScript library
- **Font Awesome** - Icon fonts
- **Liquid** - Template engine
- **Nix** - Reproducible development environment

## Liquid Template Syntax

Quick reference for editing templates:

```liquid
{{ site.title }}                    # Output variable
{% for event in site.events %}     # Loop
  {{ event.name }}
{% endfor %}
{% if condition %}...{% endif %}   # Conditional
{% include file.html param=value %} # Include partial
```

## Troubleshooting

### Build Errors

**YAML syntax error in `_config.yml`:**
- Check indentation (use spaces, not tabs)
- Ensure proper nesting
- Validate YAML syntax online

**Missing images:**
- Verify file paths match exactly
- Check file extensions (case-sensitive on Linux)
- Ensure images exist in `img/` directory

**Jekyll won't start:**
```bash
# Clear cache and try again
rm -rf .jekyll-cache _site
bundle exec jekyll serve
```

### Styling Issues

- Use browser developer tools (F12) to inspect elements
- Check Bootstrap 3 documentation for grid/component usage
- Verify custom CSS in `css/main.css` isn't conflicting

## Getting Help

For Jekyll-specific questions:
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Liquid Template Documentation](https://shopify.github.io/liquid/)

For Bootstrap 3:
- [Bootstrap 3 Documentation](https://getbootstrap.com/docs/3.3/)

## License

See LICENSE file for details.

## Acknowledgments

- Based on Start Bootstrap's "Grayscale" theme
- Built with Jekyll and Bootstrap 3
- Optimized for wedding celebrations

---

**Pro Tip:** See `.github/copilot-instructions.md` for detailed customization guidance when using GitHub Copilot!
