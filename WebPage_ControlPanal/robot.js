

let BoBo
let Fill
let linked_Robots = []
const SetUp = function()
{
     
    //Astablish Link Button Event
    $("#botConect").on("mouseup", function()
        {
            LinkRobot($("#Robot_Path").val())
        })

    // Selecting Events
    // $(".griper").live("mouseover", function(){$(this).css("border", "2px solid red" )})
    // $(".griper").live("mouseout", function(){$(this).css("border", "none" )})
    // $(".griper").live("click", ActivateControl)

    $(document).delegate(".griper","mouseover", function(){$(this).css("border", "2px solid red" )})
    $(document).delegate(".griper","mouseout", function(){$(this).css("border", "none" )})
    $(document).delegate(".griper","click", ActivateControl)

    $(document).delegate(".wrist", "mouseover", function(){$(this).css("border", "2px solid red" )})
    $(document).delegate(".wrist","mouseout", function(){$(this).css("border", "none" )})
    $(document).delegate(".wrist","click", ActivateControl)

    $(document).delegate(".elbow", "mouseover", function(){$(this).css("border", "2px solid red" )})
    $(document).delegate(".elbow", "mouseout", function(){$(this).css("border", "none" )})
    $(document).delegate(".elbow", "click", ActivateControl)

    $(document).delegate(".sholder", "mouseover", function(){$(this).css("border", "2px solid red" )})
    $(document).delegate(".sholder", "mouseout", function(){$(this).css("border", "none" )})
    $(document).delegate(".sholder", "click", ActivateControl)

    $(document).delegate(".base", "mouseover", function(){$(this).css("border", "2px solid red" )})
    $(document).delegate(".base", "mouseout", function(){$(this).css("border", "none" )})
    $(document).delegate(".base", "click", ActivateControl)

    //Action Button Events
    $(document).delegate(".actionButton", "mousedown", function()
            {
                let instruction = $(this).val()+$(this).attr("name")
                console.log(instruction)            

                let panal = $(this).parent()
                    panal = panal.parent()

                let object = panal.attr("id")
                
                SendMessage(object, instruction)

                let imgPanA = panal.children().eq(0)
                let imgPanB = panal.children().eq(2)

                switch ($(this).val()) 
                {
                    case "M1:":
                        if ($(this).attr("name") == "P") {
                            imgPanA.children().attr("src", "img/Open.png")
                            imgPanB.children().attr("src", "img/Open.png")    
                        }
                        else
                        {
                            imgPanA.children().attr("src", "img/Close.png")
                            imgPanB.children().attr("src", "img/Close.png")    
                        }
                        
                        break;
                    case "M2:":
                        if ($(this).attr("name") == "P") {
                            imgPanA.children().attr("src", "img/Raise.png")
                            imgPanB.children().attr("src", "img/Raise.png")    
                        }
                        else
                        {
                            imgPanA.children().attr("src", "img/Lower.png")
                            imgPanB.children().attr("src", "img/Lower.png")    
                        }
                        
                        break;
                    case "M3:":
                        if ($(this).attr("name") == "P") {
                            imgPanA.children().attr("src", "img/Raise.png")
                            imgPanB.children().attr("src", "img/Raise.png")    
                        }
                        else
                        {
                            imgPanA.children().attr("src", "img/Lower.png")
                            imgPanB.children().attr("src", "img/Lower.png")    
                        }
                        
                        break;
                    case "M4:":
                        if ($(this).attr("name") == "P") {
                            imgPanA.children().attr("src", "img/Forward.png")
                            imgPanB.children().attr("src", "img/Forward.png")    
                        }
                        else
                        {
                            imgPanA.children().attr("src", "img/Backwards.png")
                            imgPanB.children().attr("src", "img/Backwards.png")    
                        }
                        
                        break;
                    case "M5:":
                        if ($(this).attr("name") == "P") {
                            imgPanA.children().attr("src", "img/Clockwise.png")
                            imgPanB.children().attr("src", "img/ClockwiseT.png")    
                        }
                        else
                        {
                            imgPanA.children().attr("src", "img/CounterclockwiseT.png")
                            imgPanB.children().attr("src",  "img/Counterclockwise.png")    
                        }
                        
                        break;
                }
            })
    $(document).delegate(".actionButton", "mouseup", function()
            {
                let instruction = $(this).val()+"O"
                console.log(instruction)

                let panal = $(this).parent()
                    panal = panal.parent()

                let object = panal.attr("id")

                //Send Instruction for packaging instruction and object
                SendMessage(object, instruction)

                let imgPanA = panal.children().eq(0)
                let imgPanB = panal.children().eq(2)
    
                imgPanA.children().attr("src", "")
                imgPanB.children().attr("src", "") 
                        
            })
    
}

const LinkRobot = function(ip)
{
   //let bot = new robot()
   let soc = new WebSocket(`ws://${ip}/ws`)
   //let soc = new WebSocket(`ws://${ip}/ws`)
   console.log(soc)
   let bot = new robot(soc)

   //bot.SocketActivate(`ws://${$("#Robot_Path").val()}/ws`)
   
   //bot.MakePanal()
   linked_Robots.push(bot)
   
   console.log(linked_Robots)
    
    // let bot = new WebSocket(`ws://${$("#Robot_Path").val()}/ws`)

//     bot.addEventListener('open', (event)=>
// {
//     console.log(event)
// })

// bot.addEventListener('message', (event)=>
// {
//     let Name = event.data

// })


}

const ActivateControl = function(event)
{
    //Disable moue out for Selected. 
    $(event.currentTarget).off("mouseout")

    //Find First parent of event
    let imgParent = ($(event.currentTarget).parent(".botIMGPlot"))
    let controlingArea = $(event.currentTarget).attr("class")

    //Reset any selected Joints
    imgParent.children().each(function()
    {
        if($(this).attr("class") != $(event.currentTarget).attr("class"))
        {
            $(this).on("mouseout")
            $(this).css("border", "none" )
        }
    })

    //Get to lable and Update to selected. 
    imgParent = $(imgParent).parent()
    panalParent = $(imgParent).parent()

    let lableBlock = (panalParent.children(".botComands")).children(".botComandsLable")
    lableBlock.children().eq(1).text(controlingArea.charAt(0).toUpperCase() + controlingArea.slice(1))

    let controlBlock = ((panalParent.children(".botComands")).children(".BotInstructions")).children().eq(1)
  

    switch (controlingArea) 
    {
        case "griper":
            controlBlock.children().eq(0).attr("value", "M1:")
            controlBlock.children().eq(0).text("Open")

            controlBlock.children().eq(2).attr("value", "M1:")
            controlBlock.children().eq(2).text("Close")
            break;
        case "wrist":
            controlBlock.children().eq(0).attr("value", "M2:")
            controlBlock.children().eq(0).text("Raise")

            controlBlock.children().eq(2).attr("value", "M2:")
            controlBlock.children().eq(2).text("Lower")
            break;
        case "elbow":
            controlBlock.children().eq(0).attr("value", "M3:")
            controlBlock.children().eq(0).text("Raise")

            controlBlock.children().eq(2).attr("value", "M3:")
            controlBlock.children().eq(2).text("Lower")
            break;
        case "sholder":
            controlBlock.children().eq(0).attr("value", "M4:")
            controlBlock.children().eq(0).text("Forward")

            controlBlock.children().eq(2).attr("value", "M4:")
            controlBlock.children().eq(2).text("Backwards")
            break;
        case "base":
            controlBlock.children().eq(0).attr("value", "M5:")
            controlBlock.children().eq(0).text("Clockwise")

            controlBlock.children().eq(2).attr("value", "M5:")
            controlBlock.children().eq(2).text("Counterclockwise")
            break;
        
    }
    

}

const SendMessage = function(target, message)
{
    let botName= target.split("_")

    for(let i = 0; i< linked_Robots.length; i++)
    {
        console.log(linked_Robots[i].name)
        if(botName[1]==linked_Robots[i].name)
        {
            linked_Robots[i].SendMessage(message)
        }
    }
    console.log(botName)
    
}




$(document).ready(SetUp)


