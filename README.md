#Hillbilly Tabs + Config Panel

This project is an extension of the HillbillyTabs.js project published by Mark Rackely 
available here <http://www.markrackley.net/2014/11/25/sharepoint-tabbed-web-partshillbillytabs2-0>
	
The intent of this project was to extend the original JS file to include a configuration 
panel that would allow SharePoint users to add or remove tabs, and include multiple
webparts in each tab.

##Technical Notes
For the first version of this extension, no additional CSS or JS files were referenced
beyond what was included in the orginial HillbillyTabs script. Additional functions were 
written to provide the configuration panel functionality, without changing the core 
structure of the original script.

##Libraries
The following libraries were used in this project
- jQuery - jquery-1.11.1.min.js
- jQuery UI - ui/1.11.2/jquery-ui.min.js
- jQuery Cookie - jquery.cookie/1.4.1/jquery.cookie.min.js
- jQuery UI CSS - ui/1.11.2/themes/start/jquery-ui.css

##Usage
The HillbillyTabs-Config.js can be stored in a Site Assets or Style Library of the target
SharePoint site. Add a content editor webpart to any page with webpart zones (i.e. Webpart
page, page layout) and reference the script in content link field of the webpart. The content
link field can be accessed in the webpart settings panel of the content editor webpart.

The tab configuration panel can be accessed by editing the page. Any changes to the 
configuration panel will need to be saved by hitting the 'Save' button before the changes
can be viewed.

<img src='https://pbs.twimg.com/media/CKNiF4TUMAAc9wv.png:large' />

##Storage & Caching
The configuration settings are stored in the 'description' field of the content editor 
webpart for persistant storage. The configuration settings are also cached into a cookie 
for faster loading and saving during usage.

###Cookie Variables
1. HillbillyTabConfig - stores the configuration settings as a JSON string.
2. HillbillyTabMode - stores the current mode (basic or custom) as a 0 (basic) or 1 (custom)

Since discovering that cookies are sometimes often to < 5kb, other lightweight caching 
backends are being considered such as the browser session state.
 
##Known Limitations
* Only 1 HillbillyTab control is allowed per page.
* Caching via cookie is limited to < 5kb.
* Webpart titles of all webparts accept the content editor webpart containing the script
must not be hidden via the chrome options in the webpart settings panel.