# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite (chosen by user). Hash routing, no router dependency. Icons: lucide-react.

## Users

Parents managing a family account (kids on teams, pool memberships, party rooms) and adult players (rec leagues, court bookings, punch passes). Many sessions happen on a phone at the facility front desk or sideline.

## Product Purpose

Customer portal for Bond Sports facilities: see what's next, where to be, what's been paid, and show an ID at check-in. Operator side is out of scope.

## Positioning

Pitch / portfolio redesign concept. Replaces a white, side-tab admin-style portal with a friendly tile-based app closer to a fitness or productivity app.

## Capabilities and Constraints

- Primary areas: My Teams (active / past), My Schedule (calendar), Reservations, Passes (active / expired).
- Profile & settings holds: profile (first, last, DOB, gender, email, address, phone, role), account members, payment methods, purchase history (list + filters).
- Balance is its own surface, visible next to the member's name (e.g. "$5 due · 15 visits left").
- Bond ID: reachable via "See my ID"; Apple/Google Wallet buttons appear on mobile only.
- Accounts: Family and Business types, max one of each, each named. Roles: Primary (can edit everyone, add members, email required) and Dependent (edits own info only).
- Payment methods: card (entered inline), bank/ACH via Stripe Link, PayPal.
- Persistent "Need help?" button bottom-right.

## Brand Commitments

Bond Sports wordmark: "BOND" with a baseball as the O, "Sports" in a gold script. Palette direction from user: yellowish orange + matte blue, on the lighter side.

## Evidence on Hand

- docs/screenshots/login-current.png: current Bond Sports login.
- docs/screenshots/login-reference.png: reference login the user likes.
- All people, teams, facilities and purchases in the prototype are fictional mock data.

## Product Principles

1. What's next comes first: the next thing to show up for beats account admin.
2. One household, many people: every item says who it belongs to.
3. Admin lives one level down: settings, payments and receipts are available but never the landing view.
