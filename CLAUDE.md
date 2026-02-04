# CLAUDE.md - AI Assistant Guide for Car Marketplace Project

## Project Overview

A used car marketplace web application built with **Node.js** and **Express.js**. Users can register accounts, log in, list cars for sale, browse car listings, and search by criteria. This is a learning/educational project with Korean-language UI and comments.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.16.4
- **Template Engine**: EJS 2.6.1 (rendering `.html` files via `ejs.renderFile`)
- **Frontend**: jQuery (1.12.4 / 3.4.1), Bootstrap 4.3.1, Font Awesome 5.7.0 (all via CDN)
- **Data Storage**: JSON files on disk (no database)
- **Authentication**: `pbkdf2-password` for hashing, `express-session` for session management
- **File Uploads**: `multer` (image uploads with type filtering)
- **Package Manager**: npm

## Project Structure

```
car/
├── app1.js                  # Express app entry point (port 3000, uses index_test routes)
├── working.js               # Express app entry point (port 3001, uses index routes)
├── working backup.js        # Backup copy of working.js
├── package.json             # Dependencies (name: "chap06")
├── data/
│   ├── userlist.json        # User account data (JSON object keyed by user ID)
│   └── carlist.json         # Car listing data (JSON array)
├── router/
│   ├── index.js             # Main routes (renders views from views/)
│   ├── index_test.js        # Test routes (renders views from views/test/)
│   └── test.js              # File upload routes (multer, mounted at /test)
├── views/
│   ├── inc/
│   │   ├── head.ejs         # HTML head partial (jQuery, Bootstrap CDN links)
│   │   └── body.ejs         # Logo/home button partial
│   ├── index.html           # Homepage
│   ├── login_form.html      # Login page
│   ├── signin_form.html     # Registration/signup page
│   ├── carlist.html         # Car listing with search functionality
│   ├── regcar_form.html     # Car registration form
│   ├── carinfo.html         # Car info page
│   ├── carhistory.html      # Car history page
│   └── test/                # Duplicate views for test routes
│       └── (mirrors of above .html files)
├── public/
│   ├── stylesheets/
│   │   └── style.css        # Custom styles
│   └── images/              # Static images
└── uploads/                 # File upload destination (multer)
```

## How to Run

```bash
# Install dependencies
npm install

# Run the main app (port 3000) - uses views/test/ templates
node app1.js

# Run the working app (port 3001) - uses views/ templates
node working.js
```

> **Note**: `npm start` runs `node ./bin/www` which does not exist. Use `node app1.js` or `node working.js` directly.

## Entry Points

There are two runnable Express apps:

| File | Port | Router | Views Directory |
|------|------|--------|-----------------|
| `app1.js` | 3000 | `router/index_test.js` | `views/test/` |
| `working.js` | 3001 | `router/index.js` | `views/` |

Both apps share the same middleware stack (session, cookie-parser, flash, static files) and mount `router/test.js` at `/test`.

## Routes / API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Homepage |
| GET | `/signin_form` | Registration form page |
| POST | `/signin` | Process user registration |
| GET | `/login_form` | Login form page |
| POST | `/login` | Process login (password hash comparison) |
| GET | `/logout` | Destroy session and redirect |
| GET | `/regcar_form` | Car registration form (requires login) |
| GET | `/regcar` | Register a car via query params (AJAX) |
| GET | `/carlist` | Car listing page |
| GET | `/api/carlist` | JSON API: returns `{ cars: [...] }` |
| GET | `/search/carlist` | Search cars: `?kind=<field>&search=<value>` |
| GET | `/carinfo` | Car info page |
| GET | `/carhistory` | Car history page |
| POST | `/test/fileupload` | Single image upload (`photo` field) |
| POST | `/test/fileupload_multi` | Multi image upload (`photos` field, max 5) |

## Data Model

### User (`data/userlist.json`)
```json
{
  "userId": {
    "id": "string",
    "origin": "string (original password - stored insecurely)",
    "password": "string (pbkdf2 hash)",
    "salt": "string",
    "name": "string",
    "email": "string",
    "address": "string"
  }
}
```

### Car (`data/carlist.json`)
```json
[
  {
    "carname": "string (car model name)",
    "brand": "string (manufacturer)",
    "year": "string (year/month)",
    "distance": "string (mileage in km)",
    "price": "string (price in 만원 / 10,000 KRW units)"
  }
]
```

## Architecture Notes

### Global State
- `global.member` - User data loaded from `data/userlist.json` at startup
- `global.carlist` - Car data loaded from `data/carlist.json` at startup
- Data is written back to disk with `fs.writeFileSync()` on every mutation

### Session Configuration
- Session secret: hardcoded string `'1A@W#E$E'`
- Session stores `userid` and `name` after login
- `res.locals.user` is populated on every request via middleware

### Template Rendering
- Files are `.html` but rendered through EJS engine (`app.engine('html', require('ejs').renderFile)`)
- Partials in `views/inc/` are included via EJS `include` syntax
- Templates use `<%= %>` for variable interpolation

## Code Conventions

- **Indentation**: 4 spaces
- **Quotes**: Double quotes preferred in JavaScript
- **Variables**: Mixed `const`/`let`/`var` usage
- **Comments**: Primarily in Korean
- **Console output**: Korean-language log messages (e.g., `"번 포트로 대기중"`)
- **No linter or formatter** configured
- **No test framework** installed

## Key Patterns for AI Assistants

### When modifying routes:
- Routes are defined in `router/index.js` (production) and `router/index_test.js` (test/dev)
- Both files are nearly identical; `index_test.js` renders from `views/test/` subdirectory
- Car registration uses GET with query parameters (not POST with body)
- User registration/login uses POST with form body

### When modifying views:
- Templates live in `views/` with duplicates in `views/test/`
- All `.html` files are actually EJS templates
- Include `views/inc/head.ejs` for CDN dependencies (jQuery, Bootstrap)
- Include `views/inc/body.ejs` for the navigation/logo component
- Frontend uses jQuery AJAX for dynamic operations (car registration, search)

### When modifying data:
- JSON data files are in `data/` directory
- Always use `JSON.stringify(data, null, 8)` for writes (8-space indentation, matching existing format)
- Data is held in globals (`member`, `carlist`) and synced to disk on write
- No concurrent write protection exists

### When adding dependencies:
- Add via `npm install <package>`
- No build step required; files are used directly by Node.js

## Known Limitations

- No `.gitignore` file (risk of committing `node_modules/`, `uploads/`, session files)
- No automated tests
- No input validation or sanitization on routes
- `npm start` script points to nonexistent `./bin/www`
- `working.js` has stray characters at the end of the file (lines 53-57)
- Original password stored in plaintext in the `origin` field of user data
- No CSRF protection
- File upload filter references undefined `path` variable in `router/test.js`
