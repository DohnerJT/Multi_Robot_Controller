class robot
{
    constructor(socket)
    {
        this.Socket = socket
        this.SocketActivate()
        this.name = null

    }

    SocketActivate()
    {
        //this.Socket= new WebSocket(target)

    this.Socket.addEventListener('open', (event)=>
    {
        console.log(event)
    })
    
    this.Socket.addEventListener('message', (event)=>
    {
        if (this.name == null)
        {
            this.name = event.data
            this.MakePanal()
        }

    })

    }

    MakePanal()
    {
        this.panal = 
        `
        <div id="_${this.name}_ControlBlock" class="robotControlBlock">
            <div class="botIMG" style="background-image: url('img/RobotProfile.png');">
                <div class="botIMGPlot">
                    <div class="griper"></div>
                    <div class="wrist"></div>
                    <div class="elbow"></div>
                    <div class="sholder"></div>
                    <div class="base"></div>
                </div>                
            </div>

            <div class="botComands" id="_${this.name}_Com">
                <div class="botComandsLable">
                    <h3 style="margin: 3px auto 0px;">${this.name}</h3>
                    <h3 style="margin: 3px auto 0px;"></h3>                       
                </div>
                
                <div class="BotInstructions" id="_${this.name}_Actions">
                    <div class="Instruction ActionIddicate">
                        <img class="actionInd" src=""">
                    </div>
                    
                    <div class="Instruction botAction">
                        <button class="actionButton" name = "P" value=""></button> <br>
                        <button class="actionButton" name = "N" value=""></button>
                    </div>

                    <div class="Instruction ActionIddicate">
                        <img class="actionInd" src="">
                    </div>
                </div>                    
            </div>
        </div>  
        `

        $("#controlBody").append(this.panal)
        
    }
    
    SendMessage(message)
    {
        this.Socket.send(message)
    }
    
}