# GitHub Copilot Instructions for Jekyll Wedding Website

This is a Jekyll-based wedding website built with Bootstrap 3, designed to be easily customizable for any wedding celebration.

## Project Structure

### Jekyll Basics

- **Layouts** (`_layouts/`): Base templates for pages
  - `default.html` - Main layout with nav, footer, and JS includes
  - `info.html` - Layout for informational pages with billboard headers
- **Includes** (`_includes/`): Reusable components
  - `nav.html` - Navigation bar
  - `head.html` - HTML head with meta tags and CSS
  - `js.html` - JavaScript includes at bottom of page
  - `email_form.html` - Email subscription modal
  - `google_map.html` - Google Maps static image component
  - `hotel_thumbnail.html` - Hotel display component
  - `wedding_details.html` - Main details page content
- **Pages**: Top-level `.html` files are pages (e.g., `index.html`, `celebrations.html`, `people.html`)
- **Assets**: Static files in `css/`, `js/`, `img/` directories
- **Config**: `_config.yml` contains all wedding data and site settings

### Key Technologies

- **Jekyll**: Static site generator (v3.9.x)
- **Bootstrap 3.3.2**: CSS framework for responsive design
- **jQuery 1.11.1**: JavaScript library for interactivity
- **Font Awesome**: Icon fonts
- **Liquid**: Template engine used by Jekyll

## Customization Guide

### 1. Wedding Information (`_config.yml`)

This is the PRIMARY file for customization. All wedding-specific data lives here:

#### Site Settings

```yaml
title: Your Names
email: your.email@example.com
url: https://yourwedding.example.com
description: "We're getting married and can't wait to celebrate with you!"
```

#### Locations

Define venues with YAML anchors for reuse:

```yaml
locations:
  ceremony_venue: &ceremony_location
    location_name: Venue Name
    address1: Street Address
    address2: City, State ZIP
    coordinates: lat,long # For Google Maps
    google_maps_url: https://www.google.com/maps/...
```

#### Events

Array of wedding events (rehearsal, ceremony, reception, etc.):

```yaml
events:
  - name: Wedding Ceremony
    date: Saturday, Month Day, Year
    time: 3:00 PM
    attire: Formal
    description: Event description paragraph
    transportation: Parking/shuttle details
    <<: *ceremony_location  # Inherits location data
```

#### Hotels

Accommodation options for guests:

```yaml
hotels:
  - name: Hotel Name
    phone: +1-555-123-4567
    reserve_url: https://booking-link.com
    rate: $XXX/night
    description: Hotel description
    location_name: Hotel Name
    address1: Street
    address2: City, State ZIP
    coordinates: lat,long
    google_maps_url: https://maps.google.com/...
```

#### Wedding Party (`people:`)

- `families:` - Parents and families (with images)
- `kids:` - Flower girls, ring bearers
- `her_side:` - Bridesmaids and maid of honor
- `his_side:` - Groomsmen and best man

#### FAQ & City Guide

- `faq:` - Array of `question:` and `answer:` pairs
- `guide:` - Nested sections (explore, food, drinks) with arrays of recommendations

#### Google Services

```yaml
google:
  key: YOUR_GOOGLE_API_KEY_HERE # For Maps API

calendar:
  ical: https://calendar-url/basic.ics
  google_id: calendar-id@group.calendar.google.com
```

### 2. Template Syntax (Liquid)

#### Accessing Config Data

```liquid
{{ site.title }}                    # Simple value
{{ site.events[0].name }}          # Array access
{% for event in site.events %}     # Loop through arrays
  {{ event.name }}
  {{ event.date }}
{% endfor %}
```

#### Conditionals

```liquid
{% if event.transportation %}
  <p>{{ event.transportation }}</p>
{% endif %}
```

#### Includes with Parameters

```liquid
{% include google_map.html
   link=event.google_maps_url
   size="600x300"
   coordinates=event.coordinates %}
```

### 3. Page Customization

#### Page Front Matter

Each page starts with YAML front matter:

```yaml
---
layout: info # Layout to use
title: Page Title # Browser title
billboard_class: billboard-xyz # CSS class for header image
---
```

#### Billboard Images

Background images for section headers are CSS classes in `css/main.css`:

- `.billboard-stairs` - Staircase image
- `.billboard-wall` - Wall image
- `.billboard-bridge-walk` - Bridge walking image
- `.billboard-ramp-walk` - Ramp walking image

To customize: Replace images in `img/` directory and update CSS classes.

### 4. Bootstrap 3 Grid System

The site uses Bootstrap 3's 12-column responsive grid:

```html
<div class="container">
  <div class="row">
    <div class="col-lg-8 col-lg-offset-2 col-md-10 col-sm-12">
      <!-- Content -->
    </div>
  </div>
</div>
```

- `col-lg-*` - Large screens (≥1200px)
- `col-md-*` - Medium screens (≥992px)
- `col-sm-*` - Small screens (≥768px)
- `col-xs-*` - Extra small screens (<768px)
- `col-*-offset-*` - Add left margin
- Numbers add up to 12 per row

### 5. Common Customization Tasks

#### Change Couple Names

1. Update `title:` in `_config.yml`
2. Edit `index.html` - change `<h1 class="brand-heading">`
3. Update navigation brand: `_includes/nav.html` - change `C & N`

#### Add/Remove Events

1. Add/remove items in `events:` array in `_config.yml`
2. Define location with anchor (`&location_name`) in `locations:`
3. Reference location with `<<: *location_name` in event

#### Change Colors/Styling

- Primary stylesheet: `css/main.css`
- Bootstrap theme: `css/bootstrap.min.css`
- Gold accent color used throughout: `#AFA63D`

#### Add Wedding Party Members

1. Add photos to `img/people/squares/` (square crop)
2. Add entry to `people.her_side` or `people.his_side` in `_config.yml`
3. Format: `name:`, `pic:` (filename), `role:`, `description:`

#### Modify Navigation

Edit `_includes/nav.html`:

- Add/remove `<li>` elements
- Update active page detection with `{% if page.url == '/page/' %}`
- Maintain consistent structure

### 6. Google Maps Integration

Uses Google Maps Static API for embedded maps:

```liquid
{% include google_map.html
   link=event.google_maps_url
   size="600x300"
   coordinates=event.coordinates %}
```

**Setup Required:**

1. Get API key from Google Cloud Console
2. Enable Maps Static API and Maps Embed API
3. Update `google.key` in `_config.yml`
4. Update coordinates (lat,long format) for each location

### 7. Images

#### Directory Structure

- `img/people/squares/` - Square cropped photos for wedding party
- `img/people/optimized/` - Optimized full images
- `img/people/originals/` - Original uploads
- `img/ourstory/` - Story section photos

#### Image Optimization

- Use optimized images for web (compress with tools like ImageOptim)
- Square photos should be equal dimensions (e.g., 400x400px)
- Billboard images should be high-resolution (1920px+ width)

### 8. Development Workflow

#### Using Nix Flake (Recommended)

```bash
# Enter development environment
nix develop

# Install Ruby dependencies
bundle install

# Start local development server
jekyll serve

# View site at http://localhost:4000
```

#### Without Nix

```bash
# Install bundler
gem install bundler

# Install dependencies
bundle install

# Start server
bundle exec jekyll serve
```

### 9. Jekyll Specifics

#### Build Settings

- Markdown parser: `kramdown`
- Permalink style: `pretty` (removes .html extensions)
- Plugins: `jekyll-sitemap` (auto-generates sitemap.xml)

#### Excluded from Build

Check `.gitignore` and `_config.yml` for excluded files:

- `_site/` - Generated site output
- `.jekyll-cache/` - Cache directory
- `Gemfile.lock`, `.bundle/` - Ruby dependencies
- `result` - Nix build artifacts

### 10. Common Patterns

#### Cycling Classes (Alternating Styles)

```liquid
{% for event in site.events %}
  <section class="{% cycle 'text-left', 'text-right' %}">
    <!-- Alternates between left and right alignment -->
  </section>
{% endfor %}
```

#### YAML Anchors & Aliases

Reuse data blocks:

```yaml
locations:
  my_venue: &my_venue_ref
    location_name: Venue
    address: 123 Street

events:
  - name: Ceremony
    <<: *my_venue_ref # Inherits all properties
```

#### Conditional Content

```liquid
{% if event.shuttle %}
  <p><em>{{ event.shuttle }}</em></p>
{% endif %}
```

### 11. Troubleshooting

#### Build Errors

- Check YAML syntax in `_config.yml` (indentation matters!)
- Ensure all referenced includes exist in `_includes/`
- Verify image paths match actual file locations

#### Styling Issues

- Check Bootstrap 3 documentation for grid/component syntax
- Inspect CSS in `css/main.css` for custom overrides
- Use browser dev tools to debug responsive issues

#### Missing Content

- Verify data exists in `_config.yml`
- Check Liquid syntax: `{{ variable }}` for output, `{% tag %}` for logic
- Ensure loops reference correct data structure (`site.events`, not `events`)

## Best Practices

1. **Always test locally** before deploying changes
2. **Optimize images** before adding to `img/` directory
3. **Maintain YAML structure** when editing `_config.yml` (indentation is critical)
4. **Use semantic HTML** with Bootstrap classes for styling
5. **Keep JavaScript minimal** - site uses jQuery for basic interactivity only
6. **Mobile-first** - Test on small screens, Bootstrap handles responsive behavior
7. **Update Google API keys** - Don't commit real API keys to public repos

## Quick Reference

### File Priority for Customization

1. `_config.yml` - All wedding data
2. `index.html` - Homepage with couple's story
3. `css/main.css` - Styling tweaks
4. `_includes/wedding_details.html` - Details page content
5. `img/` - All images

### Data Access Patterns

- Site config: `site.variable_name`
- Loop: `{% for item in site.array %}`
- Conditional: `{% if condition %}`
- Output: `{{ variable }}`
- Include: `{% include file.html param=value %}`
