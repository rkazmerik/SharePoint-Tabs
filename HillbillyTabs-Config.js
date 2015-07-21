<!-- Reference the jQueryUI theme's stylesheet on the Google CDN. Here we're using the "Start" theme --> 
<link  type="text/css" rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/start/jquery-ui.css" /> 
<!-- Reference jQuery on the Google CDN --> 
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.1.min.js"></script>
<!-- Reference jQueryUI on the Google CDN --> 
<script type="text/javascript" src="//code.jquery.com/ui/1.11.2/jquery-ui.min.js"></script> 
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js"></script> 

<script type="text/javascript">
     jQuery(document).ready(function($) {

        //Put 3 web parts in 3 different tabs
//      var webPartTitles = ["Web Part Title 1","Web Part Title 2","Web Part Title 3"];
//      HillbillyTabs(webPartTitles);

        //Create a Tab with Two Web Parts, and a second tab with one Web Part
//      var webPartTitles = ["Tab 1;#Pages;#Site Pages","Tab 2;#Documents"];
//      HillbillyTabs(webPartTitles);
     
        //Put all web parts (that have visible titles) on page that have into tabs 
//        HillbillyTabs();

		//Create tabs based on configuration panel settings
		ExecuteOrDelayUntilScriptLoaded(HillbillyTabsConfig, "sp.js"); 
    });
	
	function HillbillyTabsConfig()
	{
		//detect if the page is in display or edit mode
		var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		
		//find the CEWP that contains the tabs script
		var cewpGUID = "";
		$("#contentBox div [id^='WebPartWPQ']:contains(HillbillyTabs) ").each(function()
		{
			cewpGUID = $(this).attr("WebPartID");
		});
		
		//check the users cookies for configuration settings
		var cookieJSON = $.cookie("HillbillyTabConfig");

		if (cookieJSON != null)
		{
			cookieJSON = JSON.parse([cookieJSON]);
			if(inDesignMode)
			{
				ShowConfigPanel(cookieJSON, cewpGUID);
			} else if ($.cookie("HillbillyTabMode") == 1)
			{
				HillbillyTabs(cookieJSON);
			} else
			{
				HillbillyTabs();
			}
		} else
		{
			LoadConfigFromWebPart(inDesignMode, cewpGUID);
		}
	}
	
	function LoadConfigFromWebPart(inDesignMode, cewpGUID)
	{
		//get the JSON string of existing values from the CEWP properties
		var clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl);
        var oFile = clientContext.get_web().getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
        var limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
        var webPart = limitedWebPartManager.get_webParts().getById(cewpGUID).get_webPart();
        
        
        clientContext.load(webPart, 'Properties');
		clientContext.executeQueryAsync(Function.createDelegate(this, function () {
		
            	var webpartJSON = webPart.get_properties().get_fieldValues()['Description'];
            	if(webpartJSON != "")
            	{
            		webpartJSON = JSON.parse([webpartJSON]);
            	} else
            	{
            		webpartJSON = ["Tab 1;#Webpart 1","Tab 2;#Webpart 2","Tab 3;#Webpart 3"];
            	}
            	$.cookie("HillbillyTabConfig",JSON.stringify(webpartJSON));
               	if(inDesignMode)
            	{
            		ShowConfigPanel(webpartJSON, cewpGUID);
            	} else
            	{
            		HillbillyTabs(webpartJSON);
            	}
        	}), 
        	Function.createDelegate(this, function () {
            	console.log("Failed");
        	}
        ));
	}
	
	function ShowConfigPanel(configArray, cewpGUID)
	{	
		$("#HillbillyTabs").html(" \
		<h1>Hillbilly Tab Settings</h1> \
		<div id='TabMode'> \
			<div id='TabSimpleMode'> \
				<h2><input id='TabRadioBasic' type='radio' value='basic' onclick='TogglePanelMode(0)'>Basic Mode</input></h2> \
				<p>Each webpart on the page will be shown in it's own individual tab.</p><br/> \
			</div> \
			<div id='TabCustomMode'> \
				<h2><input id='TabRadioCustom' type='radio' value='custom' onclick='TogglePanelMode(1)'>Custom Mode</input></h2> \
				<p>Allows the tabs to be configured to show multiple webparts, and \
				exclude certain webparts from the tab control.</p><br/> \
			</div> \
		</div> \
		");
		
		//set the current panel mode (basic or custom)
		TogglePanelMode($.cookie("HillbillyTabMode"));
				
		$("#HillbillyTabs").append("<table id='TabTable'><tr></tr></table>");
		
		//find the CEWP on the page
		var CEWPID = "";
        $("#tabsContainer").closest("div [id^='MSOZoneCell_WebPart']").find("span[id^='WebPartCaptionWPQ']").each(function()
        {
        	CEWPID = $(this).attr("id");
        });

		//get the webpart names on the page 
        var wpList = [];
        $("span[id^='WebPartCaptionWPQ']").each(function(index)
        {
        	if($(this).attr("id") != CEWPID && $(this).prev("span").text() != null)
        	{
        		wpList.push($(this).prev("span").text().toString());
        	}
        });
        
        if(configArray == "")
        {
        	configArray = [";#Webpart 1",";#Webpart 2",";#Webpart 3"];
        }
        
        //generate some html elements based on the config values
		for(i=0; i<configArray.length; i++)
		{
			$("#TabTable tr").append("<td id='TabColumn"+i+"' class='tabCol' valign='top'></td>");
	     	$("#TabColumn"+i).append("<div id='TabInputs'><input class='tabName'></input></div>");
	     	$("#TabColumn"+i).append("<div id='TabSelects'></div>");
	        $("#TabColumn"+i).append("<div id='TabAddRow'><a class='tabAddRow' onclick='UpdatePanelRow("+i+",0);'>+ Add webpart</a></div>");      		
			$("#TabColumn"+i).append("<div id='TabDeleteRow'><a class='tabDelRow' onclick='UpdatePanelRow("+i+",1);'>- Remove webpart</a></div>");      		
			
			var values = configArray[i].split(";#");
			
			for(c=0; c<values.length; c++)
			{
				if(c == 0)
				{
					$("#TabColumn"+i+" #TabInputs input").val(values[c]);
				}else
				{
					$("#TabColumn"+i+" #TabSelects").append("<div><select class='tabSelect'></select></div>");
					for(j=0; j<wpList.length; j++)
					{
						$("#TabColumn"+i+" #TabSelects select").append("<option value='"+wpList[j]+"'>"+wpList[j]+"</option>");
						if(wpList[j] == values[c])
						{
							$("#TabColumn"+i+" #TabSelects select:last").val(wpList[j]);
						}	
					}
				}
			}
		}
	   		    		     
		$("#TabTable tr").append("<td valign='top' id='TabLastRow'><div id='TabAddCol'><a onclick='UpdatePanelColumn(0);'>+ Add tab</a></div></td>"); 
		$("#TabLastRow").append("<div id='TabAddCol'><a onclick='UpdatePanelColumn(1);'>+ Remove tab</a></div>"); 

		$("#HillbillyTabs").append('<br/><br/><div id="TabButtons"><button id="TabReset" type="button" onclick="ShowConfigPanel(\'\',\''+cewpGUID+'\')">Reset</button></div>');		 	
 		$("#TabButtons").append('<button id="TabSave" type="button" onclick="SavePanelValues(\''+cewpGUID+'\')">Save</button>');		
	}
 	
 	function UpdatePanelColumn(operator)
 	{
 		if (operator == 0)
 		{
	 		var noTabs = $('#TabTable td').length-1;
	 
	 		$("#TabTable tr:first #TabLastRow").before("<td id='TabColumn"+noTabs+"' class='tabCol' valign='top'></td>");
	 		$("#TabColumn"+noTabs).append($("#TabColumn0").html());
	
	 		$("#TabColumn"+noTabs+" #TabAddRow a").attr("onclick","UpdatePanelRow("+noTabs+" ,0)");
	 		$("#TabColumn"+noTabs+" #TabDeleteRow a").attr("onclick","UpdatePanelRow("+noTabs+" ,1)");
	 	} else
	 	{
	 		$("#TabTable .tabCol:last").remove();
	 	}
 	}
 	
 	function UpdatePanelRow(index, operator)
 	{
 		if(operator == 0)
 		{
 			$("#TabColumn"+index+" #TabSelects").append("<div>"+$("#TabColumn"+index+" #TabSelects div:first").html()+"</div>");
 		} else if($("#TabColumn"+index+" #TabSelects div").length > 1)
  		{
 			$("#TabColumn"+index+" #TabSelects").children("div:last").remove();
 		}
 	}
 		
	function SavePanelValues(cewpGUID)
	{
		if($.cookie("HillbillyTabMode") == 0)
		{
			var displayURL =  (window.location.toString()).substring(0, window.location.toString().indexOf("?"));
            location.reload(displayURL);
		} else
		{
			var panelValues = [];
			$('.tabCol').each(function() {
	    		
	    		var s = "";
	    		s += ($('#'+this.id+' .tabName').val());
			
				$('#'+this.id+' .tabSelect').each(function() {
	    			s += ";#"+($(this).val());
				});	
				panelValues.push(s);
			});	
			
			var configJSON = JSON.stringify(panelValues);
			$.cookie("HillbillyTabConfig",configJSON);
			
			var clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl);
	        var oFile = clientContext.get_web().getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
	        var limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
	        var webPartDef = limitedWebPartManager.get_webParts().getById(cewpGUID);
	        webPartDef.get_webPart().get_properties().set_item("Description", configJSON);
	        webPartDef.saveWebPartChanges();
	        
	        clientContext.executeQueryAsync(Function.createDelegate(this, function () {
	            var displayURL =  (window.location.toString()).substring(0, window.location.toString().indexOf("?"));
	            location.reload(displayURL); 
	        }), 
	        Function.createDelegate(this, function () {
	            console.log("Failed");
	        }));
        }
	}
	
	function TogglePanelMode(operator)
	{
		if(operator == 0)
		{
			$("#TabSimpleMode p").prop('disabled',false);
			$("#TabCustomMode p").prop('disabled',true);
			$("#TabTable").children().prop('disabled',true);
			$("#TabRadioBasic").attr('checked', true);
			$("#TabRadioCustom").attr('checked', false);
			$.cookie("HillbillyTabMode", 0);
		} else
		{
			$("#TabSimpleMode p").prop('disabled',true);
			$("#TabCustomMode p").prop('disabled',false);
			$("#TabTable").children().prop('disabled',false);
			$("#TabRadioCustom").attr('checked', true);
			$("#TabRadioBasic").attr('checked', false);
			$.cookie("HillbillyTabMode", 1);
		}
	}
	
    function HillbillyTabs(webPartTitles)
    {	
        if(webPartTitles == undefined)
        {
            var CEWPID = "";
            $("#tabsContainer").closest("div [id^='MSOZoneCell_WebPart']").find("span[id^='WebPartCaptionWPQ']").each(function()
            {
                CEWPID = $(this).attr("id");
            });

            var index = 0;
            $("span[id^='WebPartCaptionWPQ']").each(function()
            {
                if($(this).attr("id") != CEWPID)
                {
                    var title = $(this).prev("span").text();
                    
                    $("#HillbillyTabs").append('<li><a href="#Tab'+index+'" id="TabHead'+index+'" onclick="HillbillyTabClick(this.id);">'+
                        title+'</a></li>').after('<div id="Tab'+index+'"></div>');
                    
                    var webPart = $(this).prev("span").hide().closest("span").closest("[id^='MSOZoneCell_WebPart']");
                    
                    $("#Tab" + index).append((webPart));
                    index++;
                }
            });
        } else {
        for(index in webPartTitles)
            {
                var title = webPartTitles[index];
                var tabContent = title.split(";#");
                if (tabContent.length > 1)
                {
                    $("#HillbillyTabs").append('<li><a href="#Tab'+index+'" id="TabHead'+index+'" onclick="HillbillyTabClick(this.id);">'+
                        tabContent[0]+'</a></li>').after('<div id="Tab'+index+'"></div>');
                
                    for(i = 1; i < tabContent.length; i++)
                    {
                        $("span[id^='WebPartCaptionWPQ']").each(function()
                        {
                            $(this).prev("span:contains('"+tabContent[i]+"')").each(function()
                            {
                                 if ($(this).text() == tabContent[i]){
                                    
                                    var webPart = $(this).closest("span").closest("[id^='MSOZoneCell_WebPart']");
                                    
                                    $("#Tab" + index).append((webPart));
                                 }
                                
                            });
                        });
                    }
                }
                else
                {
                    $("span[id^='WebPartCaptionWPQ']").each(function()
                    {
                        $(this).prev("span:contains('"+title+"')").each(function()
                        {
                             if ($(this).text() == title){
                                $("#HillbillyTabs").append('<li><a href="#Tab'+index+'" id="TabHead'+index+'" onclick="HillbillyTabClick(this.id);">'+
                                    title+'</a></li>').after('<div id="Tab'+index+'"></div>');
                                
                                var webPart = $(this).hide().closest("span").closest("[id^='MSOZoneCell_WebPart']");
                                
                                $("#Tab" + index).append((webPart));
                             }
                            
                        });
                    });
                }
            }
        }
        $("#tabsContainer").tabs();
        
        ShowActiveTab();
    
    }
    
    
    function HillbillyTabClick(id)
    {
        $.cookie("ActiveTab",id,{ path: '/' });
    }
    
    function ShowActiveTab()
    {
        $("#" + $.cookie("ActiveTab")).click();
    }
    
</script>
<div id="tabsContainer"><ul id="HillbillyTabs"></ul></div>

