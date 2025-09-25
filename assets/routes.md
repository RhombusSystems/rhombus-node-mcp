# Rhombus Console Routes Documentation

This document provides a comprehensive list of all available routes in the Rhombus Console application, organized by category and functionality. Please note that all of these routes are accurate, and should be the only internal/console routes that you reference off of.

## Table of Contents

- [Common Paths](#common-paths)
- [Parameterized Paths](#parameterized-paths)
- [External Paths](#external-paths)

## Common Paths

### Settings
| Path | Description |
|------|-------------|
| `/settings/` | General settings page |
| `/settings/licenses/` | Console Features & Licensing information |
| `/settings/alertnotifications/` | User-based alert notifications configuration |
| `/settings/alertnotifications/defaults/` | Default alert notification settings |
| `/settings/lockdown-plans/` | Lockdown plan management |
| `/settings/users/` | User management (invite, manage roles, delete users) |
| `/settings/roles/` | Role management |
| `/settings/audio-clips/` | Audio clips management |
| `/settings/access-control-credentials/` | Access control credentials |
| `/settings/access-control-credentials/active/` | Active access control credentials |
| `/settings/access-control-credentials/revoked/` | Revoked access control credentials |
| `/settings/access-control-credentials/badge-printing/` | Badge printing settings |
| `/settings/sso/` | Single Sign-On (SSO) configuration |
| `/settings/integrations/` | Various integrations including OpenAI |
| `/settings/firmware/` | Camera firmware version and updates |
| `/settings/firmware/access-control/` | Access control firmware settings |
| `/settings/camera-recording/` | Camera recording settings |
| `/settings/account/` | Account settings |
| `/settings/users/groups/` | User groups management |
| `/settings/users/partners/` | Partner users management |
| `/settings/2fa/` | Two-factor authentication settings |
| `/settings/schedules/` | Schedule setup for alarm monitoring service |
| `/settings/licenses/cameras/` | Camera license management |
| `/settings/licenses/multisensor-cameras/` | Multisensor camera license management |
| `/settings/licenses/audio-gateway/` | Audio gateway license management |
| `/settings/licenses/video-intercoms/` | Video intercom license management |
| `/settings/licenses/environmental/` | Environmental sensor license management |
| `/settings/doorcontrollers/` | Door controller settings |
| `/settings/access-control-credentials/create-template/` | Create access control credential template |

### Partner Settings
| Path | Description |
|------|-------------|
| `/settings/partner/users/` | Partner user management |
| `/settings/roles/partner/` | Partner role management |
| `/settings/partner/alertnotifications/` | Partner alert notifications |

### Integration Settings
| Path | Description |
|------|-------------|
| `/settings/integrations/avigilonAltaSettings/` | Avigilon Alta integration settings |
| `/settings/integrations/brivoSettings/` | Brivo integration settings |
| `/settings/integrations/geneaSettings/` | Genea integration settings |
| `/settings/integrations/kisiSettings/` | Kisi integration settings |
| `/settings/integrations/innerRangeSettings/` | Inner Range integration settings |
| `/settings/integrations/proDataKeySettings/` | Pro Data Key integration settings |
| `/settings/integrations/placeOsSettings/` | PlaceOS integration settings |

### Main Application Pages
| Path | Description |
|------|-------------|
| `/profile/` | User profile page |
| `/alerts/` | Alerts section (pause/snooze notifications) |
| `/alerts/threat-cases/` | Threat cases management |
| `/partner` | Partner portal |
| `/logs/` | System logs |
| `/clips/` | Video clips management |
| `/clips/timelapses/` | Timelapse clips |
| `/clips/shared/` | Shared clips |
| `/clips/shared-streams/` | Shared streams |
| `/videowalls/` | Video wall management |
| `/locations/` | Locations management |
| `/dashboard/` | Main dashboard (Bandwidth, People Counting, Vehicle Counting, Alert Trends) |
| `/devices/` | Device management and settings |

### Device Management
| Path | Description | Aliases |
|------|-------------|---------|
| `/devices/cameras/` | Camera information, image settings, and aiming | cameras |
| `/devices/tags/` | Asset tag management | tags, asset tags |
| `/devices/environmental/` | Environmental sensors (E15, E50, E1, E2) | Environmental sensors, Temperature sensors, Smoke detectors, humidity sensors |
| `/devices/door/` | Door sensor management | Door, Door Sensors |
| `/devices/motion/` | Motion sensor management | Motion sensors, occupancy sensors |
| `/devices/audio-gateway/` | Audio gateway management | Audio gateways, microphones |
| `/devices/keypad/` | Keypad reader setup for access control | Keypads, Alarm Pads |
| `/devices/buttons/` | Button sensor management | buttons |
| `/devices/video-intercoms/` | Video intercom management | video intercoms, doorbell cameras, doorbells |
| `/devices/badge-readers/` | Badge reader management | badge readers |
| `/devices/kiosks/` | Kiosk management | kiosks |
| `/devices/access-control-doors/` | Access control door management | doors |

### Investigations
| Path | Description |
|------|-------------|
| `/investigations/` | Main investigations page |
| `/investigations/investigate/` | Investigation tools |
| `/investigations/device-map/` | Device mapping for investigations |
| `/investigations/faces/` | Facial recognition investigations |
| `/investigations/faces/saved/` | Saved faces |
| `/investigations/faces/uploaded/` | Uploaded faces |
| `/investigations/faces/manage/` | Face management |
| `/investigations/license-plates/` | License plate investigations |
| `/investigations/license-plates/saved/` | Saved license plates |
| `/investigations/search/` | Investigation search |

### Guest Management
| Path | Description |
|------|-------------|
| `/guest-management/guests/` | Guest management |
| `/guest-management/guest-logs/` | Guest logs |
| `/guest-management/customization-settings/` | Guest management customization |
| `/kiosk/` | Kiosk interface |

### Logs
| Path | Description |
|------|-------------|
| `/logs/alarm-monitoring/` | Alarm monitoring logs |
| `/logs/alarm-monitoring/monthly/` | Monthly alarm monitoring logs |
| `/logs/envoy/guests/` | Envoy guest logs |
| `/logs/envoy/guests/packages/` | Envoy guest package logs |

## Parameterized Paths

### Location-Specific Routes
| Path | Description |
|------|-------------|
| `/locations/:locationUuid/` | View, manage, and monitor a location and its devices |
| `/locations/:locationUuid/access-control/` | Location access control |
| `/locations/:locationUuid/devices/` | Location device management |
| `/locations/:locationUuid/alarm-monitoring/` | Location alarm monitoring |
| `/locations/:locationUuid/settings-and-details/` | Location settings and details |
| `/locations/:locationUuid/settings-and-details/device-placement/` | Device placement settings |
| `/locations/:locationUuid/settings-and-details/reports/` | Location reports |
| `/locations/:locationUuid/access-control/access-control-doors/` | Location access control doors |
| `/locations/:locationUuid/access-control/access-grants/` | Location access grants |
| `/locations/:locationUuid/access-control/access-revocations/` | Location access revocations |
| `/locations/:locationUuid/access-control/door-controllers/` | Location door controllers |
| `/locations/:locationUuid/access-control/user-access/` | Location user access |
| `/locations/:locationUuid/access-control/lockdown-plans/` | Location lockdown plans |
| `/locations/:locationUuid/alerts/` | Location alerts |
| `/locations/:locationUuid/alerts/threat-cases/` | Location threat cases |

### Location Device Management
| Path | Description | Aliases |
|------|-------------|---------|
| `/locations/:locationUuid/devices/cameras/` | Location-specific camera list | cameras |
| `/locations/:locationUuid/devices/audio-gateway/` | Location-specific audio gateway list | Audio gateways, microphones |
| `/locations/:locationUuid/devices/environmental/` | Location-specific environmental sensor list | Environmental sensors, Temperature sensors, Smoke detectors, humidity sensors |
| `/locations/:locationUuid/devices/video-intercoms/` | Location-specific video intercom list | video intercoms, doorbell cameras, doorbells |
| `/locations/:locationUuid/devices/badge-readers/` | Location-specific badge reader list | badge readers |
| `/locations/:locationUuid/devices/door/` | Location-specific door sensor list | Door, Door Sensors |
| `/locations/:locationUuid/devices/motion/` | Location-specific motion sensor list | Motion sensors, occupancy sensors |
| `/locations/:locationUuid/devices/buttons/` | Location-specific button sensor list | buttons |
| `/locations/:locationUuid/devices/keypad/` | Location-specific keypad list | Keypads, Alarm Pads |
| `/locations/:locationUuid/devices/kiosks/` | Location-specific kiosk list | kiosks |
| `/locations/:locationUuid/devices/tags/` | Location-specific tag list | tags, asset tags |
| `/locations/:locationUuid/devices/no-devices/` | No devices page |

### Individual Device Pages (Location-Specific)
| Path | Description | Aliases |
|------|-------------|---------|
| `/locations/:locationUuid/devices/cameras/:cameraUuid/` | Individual camera page with settings, storage, bitrate, resolution | cameras |
| `/locations/:locationUuid/devices/cameras/:cameraUuid/?t={ms}` | Camera page with timestamp navigation | cameras |
| `/locations/:locationUuid/devices/environmental/:sensorUuid/` | Individual environmental sensor page | Environmental sensors, Temperature sensors, Smoke detectors, humidity sensors |
| `/locations/:locationUuid/devices/tags/:tagUuid/` | Individual tag page | tags, asset tags |
| `/locations/:locationUuid/devices/motion/:sensorUuid/` | Individual motion sensor page | Motion sensors, occupancy sensors |
| `/locations/:locationUuid/devices/audio-gateway/:sensorUuid/` | Individual audio gateway page | Audio gateways, microphones |
| `/locations/:locationUuid/devices/keypad/:keypadUuid/` | Individual keypad page | Keypads, Alarm Pads |
| `/locations/:locationUuid/devices/kiosks/:kioskUuid/` | Individual kiosk page | kiosks |
| `/locations/:locationUuid/devices/door/:sensorUuid/` | Individual door sensor page | Door, Door Sensors |
| `/locations/:locationUuid/devices/buttons/:sensorUuid/` | Individual button sensor page | buttons |
| `/locations/:locationUuid/devices/video-intercoms/:deviceUuid/` | Individual video intercom page | video intercoms, doorbell cameras, doorbells |

### Location Alarm Monitoring
| Path | Description |
|------|-------------|
| `/locations/:locationUuid/alarm-monitoring/alarm-central/` | Alarm central for location |
| `/locations/:locationUuid/alarm-monitoring/emergency-contacts/` | Emergency contacts for location |
| `/locations/:locationUuid/alarm-monitoring/entry-instructions/` | Entry instructions for location |
| `/locations/:locationUuid/alarm-monitoring/submission-delays/` | Submission delays for location |
| `/locations/:locationUuid/alarm-monitoring/pins/` | PIN management for location |
| `/locations/:locationUuid/alarm-monitoring/monitoring-schedules/` | Monitoring schedules for location |

### User Management
| Path | Description |
|------|-------------|
| `/settings/users/:uuid/` | Individual user management |
| `/settings/users/groups/:uuid/` | Individual user group management |
| `/settings/users/partners/:uuid/` | Individual partner user management |
| `/settings/users/:uuid/access-control/authentication-details/` | User authentication details |
| `/settings/users/:uuid/access-control/group-membership/` | User group membership |
| `/settings/users/:uuid/access-control/location-access/` | User location access |
| `/settings/roles/?roleUuid=[uuid]` | Role creation and management |
| `/settings/partner/users/:uuid/` | Individual partner user management |
| `/settings/roles/partner/?roleUuid=[uuid]` | Partner role management |

### Partner Management
| Path | Description |
|------|-------------|
| `/partner/:uuid` | Individual partner page |
| `/partner/:uuid?device=[serialNo]&type=:deviceType` | Partner page with device filter |

### Access Control
| Path | Description | Aliases |
|------|-------------|---------|
| `/devices/access-control-doors/:uuid/` | Individual access control door page | doors |
| `/devices/access-control-doors/:uuid/events/` | Access control door events |
| `/devices/access-control-doors/:uuid/settings-and-details/` | Access control door settings |
| `/devices/access-control-doors/:uuid/user-access/` | Access control door user access |
| `/devices/access-control-doors/:uuid/doorbell-rules/` | Access control door doorbell rules |
| `/devices/access-control-doors/:uuid` | Individual access control door page | doors |

### Video Intercoms
| Path | Description | Aliases |
|------|-------------|---------|
| `/devices/video-intercoms/:uuid/alerts/` | Video intercom alerts |
| `/devices/video-intercoms/:uuid/settings-and-details/` | Video intercom settings |
| `/devices/video-intercoms/:uuid/events/` | Video intercom events |
| `/locations/:locationUuid/video-intercoms/:uuid/alerts/` | Location-specific video intercom alerts | video intercoms, doorbell cameras, doorbells |
| `/locations/:locationUuid/video-intercoms/:uuid/settings-and-details/` | Location-specific video intercom settings |
| `/locations/:locationUuid/video-intercoms/:uuid/events/` | Location-specific video intercom events |
| `/devices/video-intercoms/:uuid?t={ms}` | Video intercom with timestamp navigation | video intercoms, doorbell cameras, doorbells |

### Lockdown Plans
| Path | Description |
|------|-------------|
| `/settings/lockdown-plans/:uuid/` | Individual lockdown plan management |

### Device Management (Global)
| Path | Description | Aliases |
|------|-------------|---------|
| `/devices/door/:uuid` | Individual door page | Door, Door Sensors |
| `/devices/audio-gateway/:uuid` | Individual audio gateway page | Audio gateways, microphones |
| `/devices/audio-gateway/:uuid/alerts/` | Audio gateway alerts |
| `/devices/cameras/:uuid` | Individual camera page (aiming, settings) | cameras |
| `/devices/cameras/:uuid?t={ms}` | Camera page with timestamp navigation | cameras |
| `/devices/access-control-doors/:uuid` | Individual access control door page | doors |
| `/devices/badge-readers/:uuid` | Individual badge reader page | badge readers |
| `/devices/environmental/:uuid` | Individual environmental sensor page | Environmental sensors, Temperature sensors, Smoke detectors, humidity sensors |
| `/devices/motion/:uuid` | Individual motion sensor page | Motion sensors, occupancy sensors |
| `/devices/buttons/:uuid/` | Individual button sensor page | buttons |
| `/devices/buttons/:uuid/events/` | Button sensor events |
| `/devices/keypad/:uuid` | Individual keypad page | Keypads, Alarm Pads |
| `/kiosks/:uuid/` | Individual kiosk page | kiosks |
| `/devices/tags/:uuid` | Individual tag page | tags, asset tags |

### Device Alerts and Historical Data
| Path | Description |
|------|-------------|
| `/devices/door/:uuid/alerts/` | Door sensor alerts |
| `/devices/door/:uuid/historical/` | Door sensor historical data |
| `/devices/motion/:uuid/alerts/` | Motion sensor alerts |
| `/devices/motion/:uuid/historical/` | Motion sensor historical data |
| `/devices/environmental/:uuid/alerts/` | Environmental sensor alerts |
| `/devices/environmental/:uuid/historical/` | Environmental sensor historical data |

### Device Search and Filtering
| Path | Description |
|------|-------------|
| `/devices/badge-readers/?search=[name]` | Search badge readers by name |
| `/device-setup/:deviceType` | Device setup for specific type |
| `/devices/cameras/?locationUuids=[locationUuids]` | Filter cameras by location UUIDs |
| `/devices/keypad/?locationUuids=[locationUuids]` | Filter keypads by location UUIDs |
| `/devices/door/?locationUuids=[locationUuids]` | Filter doors by location UUIDs |
| `/devices/buttons/?locationUuids=[locationUuids]` | Filter buttons by location UUIDs |
| `/devices/badge-readers/?locationUuids=[locationUuids]` | Filter badge readers by location UUIDs |

### Alerts and Monitoring
| Path | Description | Aliases |
|------|-------------|---------|
| `/alerts/?modal=alert/:uuid` | Specific policy alert details | Policy alerts |
| `/logs/alarm-monitoring/monthly/?location=[locationUuid]&startTime=[startTime]` | Monthly alarm monitoring logs with location and time filters |

### Video Walls
| Path | Description |
|------|-------------|
| `/videowalls/:uuid` | Individual video wall page |

### Investigations
| Path | Description |
|------|-------------|
| `/investigations/faces/face/:faceId` | Individual face investigation (Facial Recognition) |
| `/investigations/license-plates/license-plate/?id=[licensePlateId]` | Individual license plate investigation |

### Settings and Policies
| Path | Description |
|------|-------------|
| `/settings/policies/audio-gateway/:uuid/` | Audio gateway policy settings |
| `/settings/alertnotifications/:uuid/` | Individual alert notification settings |
| `/settings/partner/alertnotifications/:uuid/` | Individual partner alert notification settings |
| `/settings/doorcontrollers/:uuid` | Individual door controller settings |
| `/settings/access-control-credentials/edit-template/:templateUuid/` | Edit access control credential template |

### Guest Management
| Path | Description |
|------|-------------|
| `/guest-management/:guestEmail/` | Individual guest management by email |

## External Paths

| Path | Description |
|------|-------------|
| `https://support.rhombussystems.com/hc/en-us/requests/new` | Submit new support requests |
| `https://www.rhombussystems.com/contact-sales/` | Contact Rhombus Sales |
| `https://support.rhombussystems.com/hc/en-us/articles/32668973468685-Managing-Facial-Recognition-v2-Beta#h_01JEYG3ASKNBJ4DSB7XN4W5R9M` | Facial Recognition v2 Beta documentation |
| `https://support.rhombussystems.com/hc/en-us/articles/32668973468685-Managing-Facial-Recognition-v2-Beta#h_01JEYG3WPWTN28061X2SADG0QN` | Facial Recognition v2 Beta documentation (section 2) |
| `https://support.rhombussystems.com/hc/en-us/articles/12620644326413-B10-Setup-Walkthrough-and-Troubleshooting#h_01J0CBEZZ7E44FHYW6FT8ZRZJB` | B10 Setup Walkthrough and Troubleshooting |

## Notes

- **Parameterized Paths**: Routes with `:parameter` require the parameter to be replaced with actual values (e.g., `:locationUuid` should be replaced with a valid location UUID)
- **Query Parameters**: Routes with `?parameter=value` support query parameters for filtering and navigation
- **Aliases**: Many device types have common aliases that users might use to refer to them
- **Timestamp Navigation**: Camera and video intercom routes support `?t={ms}` parameter for jumping to specific timestamps in footage
- **Location-Specific vs Global**: Some routes are location-specific (require `:locationUuid`) while others are global device management routes

## Camera Models Supported

The system supports various Rhombus camera models including:
- R100/R120
- R2/R200/R2-180
- R360
- R400
- R500
- R600

## Environmental Sensors

Supported environmental sensor models include:
- E15
- E50
- E1
- E2
