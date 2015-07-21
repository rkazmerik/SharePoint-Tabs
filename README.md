<<<<<<< HEAD
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
The following libraries were used in this project:
1. jQuery - jquery-1.11.1.min.js
2. jQuery UI - ui/1.11.2/jquery-ui.min.js
3. jQuery Cookie - jquery.cookie/1.4.1/jquery.cookie.min.js
4. jQuery UI CSS - ui/1.11.2/themes/start/jquery-ui.css

##Usage
The HillbillyTabs-Config.js can be stored in a Site Assets or Style Library of the target
SharePoint site. Add a content editor webpart to any page with webpart zones (i.e. Webpart
page, page layout) and reference the script in content link field of the webpart. The content
link field can be accessed in the webpart settings panel of the content editor Webpart.

The tab configuration panel can be accessed by editing the page. Any changes to the 
configuration panel will need to be saved by hitting the 'Save' button before the changes
can be viewed.

##Storage


##Caching
Since discovering that cookies are sometimes limited to < 5kb, other lightweight caching 
backends are being considered such as the browser session state.
 
##Known Limitations