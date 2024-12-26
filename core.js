class RegistryUI{

}
class Registry{

}
class HeapUI{

}
class Heap{

}
class MemoryCellUI{

}
class MemoryCell{
    static count = 0;
    ui = new MemoryCellUI();
    value = 0;
    id = 0;

    MemoryCell(value){
        MemoryCell.count++;
        this.id = MemoryCell.count;
        this.value = value;
    }
}
class EmulatorUI{
    inputs = document.querySelectorAll("input");
    buttons = document.querySelectorAll("button");
    selectors = document.querySelectorAll("select");
    movOn = document.querySelector("#mov_on");
    logWindow = document.querySelector("#log");
}
class Emulator{
    static logCount = 0;
    working = false;
    ui = new EmulatorUI();

    start(){

    }
    stop(){

    }
    convert(value){
        const value16bit = value & 0xFFFF;
        let hexValue = value16bit.toString(16).toUpperCase().padStart(4, "0");
        return hexValue;
    }
    move(){

    }
    random(){

    }
}

function EMU(){
    this.working = false;
    this.inputs = document.getElementsByTagName("input");
    this.btns = document.getElementsByTagName("button");
    this.selects = document.getElementsByTagName("select");
    this.movon = document.getElementById("mov_on");
    this.log_cnt = 0;
    this.pamiec = new PAM();
    this.stos = new STOS();
    

    this.spzap = [
        document.getElementById("dpam"),
        document.getElementById("zpam"),
        document.getElementById("drj")
    ];
    this.rejestr = [
        document.getElementById("ax"),
        document.getElementById("bx"),
        document.getElementById("cx"),
        document.getElementById("dx"),
        document.getElementById("si"),
        document.getElementById("di"),
        document.getElementById("bp"),
        document.getElementById("sp"),
        document.getElementById("disp")
    ];

    this.hex = {
        "0":0,
        "1":1,
        "2":2,
        "3":3,
        "4":4,
        "5":5,
        "6":6,
        "7":7,
        "8":8,
        "9":9,
        "A":10,
        "B":11,
        "C":12,
        "D":13,
        "E":14,
        "F":15
    };
    this.dec = {
        0:"0",
        1:"1",
        2:"2",
        3:"3",
        4:"4",
        5:"5",
        6:"6",
        7:"7",
        8:"8",
        9:"9",
        10:"A",
        11:"B",
        12:"C",
        13:"D",
        14:"E",
        15:"F"
    };
}
EMU.prototype.start = function(){
    //main function for start system
    this.working = true;

    console.log("Emu działa..");
    console.log("Włączam możliwość wprowadzania danych..");
    console.log("Inicjowanie pamięci..")
    this.pamiec.inicjacja();
    for(i = 1; i < this.btns.length;i++){
        this.btns[i].disabled = false;
    }
    for(i = 0; i < this.inputs.length;i++){
        if(this.inputs[i].type !== "text" || this.inputs[i].id == "mov_on")
        this.inputs[i].disabled = false;
    }
    for(i = 0; i < this.selects.length;i++){
        this.selects[i].disabled = false;
    }
    this.odbmov();
    document.getElementById("mov_b").disabled = false;
    document.getElementById("xchg_b").disabled = false;
    document.getElementById("start").disabled = false;
    document.getElementById("stop").disabled = false;
}
EMU.prototype.stop = function(){
    //function for stop system
    this.working = false;

    console.log("Wyłączam możliwość wprowadzania danych..");
    for(i = 1; i < this.btns.length;i++){
        this.btns[i].disabled = true;
    }
    for(i = 0; i < this.inputs.length;i++){
        this.inputs[i].disabled = true;
    }
    for(i = 0; i < this.selects.length;i++){
        this.selects[i].disabled = true;
    }
    while (this.stos.DOMobj.firstChild) {
        this.stos.DOMobj.removeChild(this.stos.DOMobj.firstChild);
    }
    this.stos.pam = [];
    this.stos.licznik = -1;
    document.getElementById("wskaznik").style = "height: calc(calc(100%/32767)*"+(this.licznik)+");";
    document.getElementById("stop").disabled = true;
    document.getElementById("start").disabled = false;
    console.log("Emu nie działa..");
}
EMU.prototype.checker_mov = function(){
    //console.log(movon.value);
    let ilosc = movon.value;
    if(ilosc.length >= 5){
        alert("Nie przekraczaj 16bitów pamięci!");
        movon.value = 
        movon.value[0]+
        movon.value[1]+
        movon.value[2]+
        movon.value[3];
    }
}
EMU.prototype.mov = function(){

    let direction = document.getElementById('mov_s').value;
    //sprawdzenie ktora forma zapisu została wybrana
    for(i=0;i<this.spzap.length;i++){
        switch (this.spzap[i].id){
           case "dpam": 
           if(this.spzap[i].checked){
                //mov z rejestru do pamieci
                let rj = document.getElementsByName("wybrej");
                let rj1 = document.getElementsByName("sind2");
                let displ = this.konwerter(document.getElementById("disp").value);
                    if(displ!=="0000"){
                            displ = this.konwerter(document.getElementById("disp").value);
                    }
                    else{
                        displ = 0
                    }
                for(i=0;i<8;i++){
                    if(i<4){
                        if(rj[i].checked){
                            this.pamiec.zapis(
                                document.getElementById(direction).value,
                                this.konwerter(document.getElementById(rj[i].value).value)+displ
                            );
                            console.log("Zapis ("+document.getElementById(direction).value+") do komórki o adresie= "+
                            this.pamiec.generatorPoz(this.konwerter(document.getElementById(rj[i].value).value)+displ));
                        }
                    }
                    else{
                        if(rj1[i-4].checked){
                            this.pamiec.zapis(
                                document.getElementById(direction).value,
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[0]+
                                    rj1[i-4].value[1]
                                    ).value)+
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[2]+
                                    rj1[i-4].value[3]
                                    ).value)+displ
                            );
                            console.log("Zapis ("+document.getElementById(direction).value+") do komórki o adresie= "+
                            this.pamiec.generatorPoz(this.konwerter(document.getElementById(
                                rj1[i-4].value[0]+
                                rj1[i-4].value[1]
                                ).value)+
                            this.konwerter(document.getElementById(
                                rj1[i-4].value[2]+
                                rj1[i-4].value[3]
                                ).value)+displ));
                        }
                    }
                } 
           }
           break;
           case "zpam":
            if(this.spzap[i].checked){
                //mov z pamieci do rejestru
                let rj = document.getElementsByName("wybrej");
                let rj1 = document.getElementsByName("sind2");
                let displ = this.konwerter(document.getElementById("disp").value);
                    if(displ!=="0000"){
                            displ = this.konwerter(document.getElementById("disp").value);
                    }
                    else{
                        displ = 0
                    }
                for(i=0;i<8;i++){
                    if(i<4){
                        if(rj[i].checked){
                            this.pamiec.odczyt(
                                direction,
                                this.konwerter(document.getElementById(rj[i].value).value)+displ
                            );
                            console.log("Zapis do komórki ("+direction+") = "+
                            this.pamiec.pam[this.pamiec.generatorPoz(this.konwerter(document.getElementById(rj[i].value).value)+displ)].hex);
                        }
                    }
                    else{
                        if(rj1[i-4].checked){
                            this.pamiec.odczyt(
                                direction,
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[0]+
                                    rj1[i-4].value[1]
                                    ).value)+
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[2]+
                                    rj1[i-4].value[3]
                                    ).value)+displ
                            );
                            console.log("Zapis do komótki ("+direction+") = "+
                            this.pamiec.pam[
                            this.pamiec.generatorPoz(this.konwerter(document.getElementById(
                                rj1[i-4].value[0]+
                                rj1[i-4].value[1]
                                ).value)+
                            this.konwerter(document.getElementById(
                                rj1[i-4].value[2]+
                                rj1[i-4].value[3]
                                ).value)+displ)
                            ].hex);
                        }
                    }
                }
           }
           break;
           case "drj":
               //zapis do rejestru
            if(this.spzap[i].checked){
                let wart = this.movon.value;
                let czy_dobra_wart = false;
                for(i=0;i<4;i++){
                    if(!isNaN(this.konwerter(wart))){
                        czy_dobra_wart = true;
                    }
                    else{
                        czy_dobra_wart = false;
                    }
                }
                if(czy_dobra_wart){
                    document.getElementById(direction).value = wart;
                }
                else{
                    alert("Niepoprawna Wartość dla komendy MOV! Użyj znaków HEXADECYMALNEGO systemu liczbowego!");
                    this.movon.value = "0000"
                }
           }
           break;
        }
        
    }
    

}
EMU.prototype.reset1 = function(){
    for(i=0;i<4;i++){
        this.rejestr[i].value = "0000";
    }
}
EMU.prototype.indeksowy = function(){
    document.getElementById("op_si").disabled = false;
    document.getElementById("op_di").disabled = false;

    document.getElementById("op_bx").disabled = true;
    document.getElementById("op_bp").disabled = true;

    document.getElementById("op_si_bx").disabled = true;
    document.getElementById("op_di_bx").disabled = true;
    document.getElementById("op_si_bp").disabled = true;
    document.getElementById("op_di_bp").disabled = true;

    document.getElementById("mov_b").disabled=false;
    let rj = document.getElementsByName("wybrej");
    let rj1 = document.getElementsByName("sind2");
    for(i=2;i<4;i++){
        rj[i].checked=false;
    }
    for(i=0;i<4;i++){
        rj1[i].checked=false;
    }
} 
EMU.prototype.bazowy = function(){
    document.getElementById("op_si").disabled = true;
    document.getElementById("op_di").disabled = true;

    document.getElementById("op_bx").disabled = false;
    document.getElementById("op_bp").disabled = false;

    document.getElementById("op_si_bx").disabled = true;
    document.getElementById("op_di_bx").disabled = true;
    document.getElementById("op_si_bp").disabled = true;
    document.getElementById("op_di_bp").disabled = true;

    document.getElementById("mov_b").disabled=false;
    let rj = document.getElementsByName("wybrej");
    let rj1 = document.getElementsByName("sind2");
    for(i=0;i<2;i++){
        rj[i].checked=false;
    }
    for(i=0;i<4;i++){
        rj1[i].checked=false;
    }
}
EMU.prototype.indeksowo_bazowy = function(){
    document.getElementById("op_si").disabled = true;
    document.getElementById("op_di").disabled = true;

    document.getElementById("op_bx").disabled = true;
    document.getElementById("op_bp").disabled = true;

    document.getElementById("op_si_bx").disabled = false;
    document.getElementById("op_di_bx").disabled = false;
    document.getElementById("op_si_bp").disabled = false;
    document.getElementById("op_di_bp").disabled = false;

    document.getElementById("mov_b").disabled=false;
    let rj = document.getElementsByName("wybrej");
    for(i=0;i<4;i++){
        rj[i].checked=false;
    }

}
EMU.prototype.brak_wyb = function(){
    document.getElementById("op_si").disabled = true;
    document.getElementById("op_di").disabled = true;

    document.getElementById("op_bx").disabled = true;
    document.getElementById("op_bp").disabled = true;

    document.getElementById("op_si_bx").disabled = true;
    document.getElementById("op_di_bx").disabled = true;
    document.getElementById("op_si_bp").disabled = true;
    document.getElementById("op_di_bp").disabled = true;

    document.getElementById("mov_b").disabled=true;
    let rj = document.getElementsByName("wybrej");
    let rj1 = document.getElementsByName("sind2");
    for(i=0;i<4;i++){
        rj[i].checked=false;
    }
    for(i=0;i<4;i++){
        rj1[i].checked=false;
    }
}
EMU.prototype.reset2 = function(){
    for(i=4;i<this.rejestr.length;i++){
        this.rejestr[i].value = "0000";
    }
}
EMU.prototype.zabmov = function(){
    this.movon.disabled = true;

    document.getElementById("ind").disabled = false;
    document.getElementById("baz").disabled = false;
    document.getElementById("indbaz").disabled = false;
    document.getElementById("brak1").disabled = false;
    document.getElementById("brak1").checked = true;

    document.getElementById("mov_b").disabled=true;
    this.brak_wyb();
}
EMU.prototype.odbmov = function(){
    this.movon.disabled = false;

    document.getElementById("ind").disabled = true;
    document.getElementById("baz").disabled = true;
    document.getElementById("indbaz").disabled = true;
    document.getElementById("brak1").disabled = true;

    document.getElementById("brak1").checked = true;
    
    this.brak_wyb();
    document.getElementById("mov_b").disabled=false;
}
EMU.prototype.xchg = function(){    
    let sp = document.getElementById("xchg_s_p").value;
    let sl = document.getElementById("xchg_s_l").value;
    let lw = document.getElementById(sl).value;
    let pw = document.getElementById(sp).value;
    document.getElementById(sp).value = lw;
    document.getElementById(sl).value = pw;
    
}
EMU.prototype.xchg1 = function(){
    let direction = document.getElementById('mov_s').value;
    //sprawdzenie ktora forma zapisu została wybrana
    for(j=0;j<this.spzap.length;j++){
        let rj = document.getElementsByName("wybrej");
        let rj1 = document.getElementsByName("sind2");
        let displ = this.konwerter(document.getElementById("disp").value);
            if(displ!=="0000"){
                    displ = this.konwerter(document.getElementById("disp").value);
            }
            else{
                displ = 0
            }
        //potrzebuje wartosc z rejestru i wartosc z pamieci a pozniej je zapisac do rejestru i do pamieci
        let x = document.getElementById(direction).value; //wartosc z rejestru
        let y = "0000";
        for(i=0;i<8;i++){
            if(i<4){
                if(rj[i].checked){
                    y = this.pamiec.pam[this.pamiec.generatorPoz(this.konwerter(document.getElementById(rj[i].value).value)+displ)].hex;
                }
            }
            else{
                if(rj1[i-4].checked){
                    y = this.pamiec.generatorPoz(this.konwerter(document.getElementById(
                        rj1[i-4].value[0]+
                        rj1[i-4].value[1]
                        ).value)+
                    this.konwerter(document.getElementById(
                        rj1[i-4].value[2]+
                        rj1[i-4].value[3]
                        ).value)+displ);
                }
            }
        }
        switch (this.spzap[j].id){
           case "dpam": 
           if(this.spzap[j].checked){
                for(i=0;i<8;i++){
                    if(i<4){
                        if(rj[i].checked){
                            this.pamiec.zapis(
                                x,
                                this.konwerter(document.getElementById(rj[i].value).value)+displ
                            );
                            document.getElementById(direction).value = y;
                            console.log("Zapis ("+x+") do komórki o adresie= "+
                            this.pamiec.generatorPoz(this.konwerter(document.getElementById(rj[i].value).value)+displ));
                            console.log("Zapis ("+y+") do rejestru =" +direction);
                        }
                    }
                    else{
                        if(rj1[i-4].checked){
                            this.pamiec.zapis(
                                x,
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[0]+
                                    rj1[i-4].value[1]
                                    ).value)+
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[2]+
                                    rj1[i-4].value[3]
                                    ).value)+displ
                            );
                            document.getElementById(direction).value = y
                            console.log("Zapis ("+x+") do komórki o adresie= "+
                            this.pamiec.generatorPoz(this.konwerter(document.getElementById(
                                rj1[i-4].value[0]+
                                rj1[i-4].value[1]
                                ).value)+
                            this.konwerter(document.getElementById(
                                rj1[i-4].value[2]+
                                rj1[i-4].value[3]
                                ).value)+displ));
                            console.log("Zapis ("+y+") do rejestru =" +direction);
                        }
                    }
                } 
           }
           break;
           case "zpam":
            if(this.spzap[j].checked){
                for(i=0;i<8;i++){
                    if(i<4){
                        if(rj[i].checked){
                            this.pamiec.zapis(
                                x,
                                this.konwerter(document.getElementById(rj[i].value).value)+displ
                            );
                            document.getElementById(direction).value = y;
                            console.log("Zapis ("+x+") do komórki o adresie= "+
                            this.pamiec.generatorPoz(this.konwerter(document.getElementById(rj[i].value).value)+displ));
                            console.log("Zapis ("+y+") do rejestru =" +direction);
                        }
                    }
                    else{
                        if(rj1[i-4].checked){
                            this.pamiec.zapis(
                                x,
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[0]+
                                    rj1[i-4].value[1]
                                    ).value)+
                                this.konwerter(document.getElementById(
                                    rj1[i-4].value[2]+
                                    rj1[i-4].value[3]
                                    ).value)+displ
                            );
                            document.getElementById(direction).value = y
                            console.log("Zapis ("+x+") do komórki o adresie= "+
                            this.pamiec.generatorPoz(this.konwerter(document.getElementById(
                                rj1[i-4].value[0]+
                                rj1[i-4].value[1]
                                ).value)+
                            this.konwerter(document.getElementById(
                                rj1[i-4].value[2]+
                                rj1[i-4].value[3]
                                ).value)+displ));
                            console.log("Zapis ("+y+") do rejestru =" +direction);
                        }
                    }
                } 
           }
           break;
           case "drj":
               //xchg na rejestrze
            if(this.spzap[j].checked){
                let sp = document.getElementById("xchg_s_p").value;
                let sl = document.getElementById("xchg_s_l").value;
                let lw = document.getElementById(sl).value;
                let pw = document.getElementById(sp).value;
                document.getElementById(sp).value = lw;
                document.getElementById(sl).value = pw;
           }
           break;
        }   
    }
}
EMU.prototype.random = function(){
        min = Math.ceil(0);
        max = Math.floor(65534);
        for(i=0;i<100;i++){
            if(i==50){
                document.getElementById("ax").value = 
                this.dekonverter(
                    Math.floor(Math.random() * (max - min + 1)) + min
                )
            }
            if(i/2==25){
                document.getElementById("bx").value = 
                this.dekonverter(
                    Math.floor(Math.random() * (max - min + 1)) + min
                )
            }
            if(i==70){
                document.getElementById("cx").value = 
                this.dekonverter(
                    Math.floor(Math.random() * (max - min + 1)) + min
                )
            }
            if(i/2==5){
                document.getElementById("dx").value = 
                this.dekonverter(
                    Math.floor(Math.random() * (max - min + 1)) + min
                )
            }
        }
        
        return true;
}

function KPAM(wartosc, dec, pozycja, id){
    this.hex = wartosc;
    this.dec = dec;
    this.poz = pozycja;
    this.id = id;
    this.dlugosc = 2;
}

function PAM(){
    this.DOMobj = document.getElementById("pam");
    this.licznik = -1;
    this.max_kom = 32767;
    this.pam = [];
    // 16bit = 2B = 65535dec
    // 1024B = 1kB = 16384b = 33553920dec
    // 64kB = 1048576b = 2147450880dec
}
PAM.prototype.dodajkom = function(hex,dec){
    this.licznik = this.licznik + 1;
    let k = new KPAM(hex,dec,this.licznik,"p"+this.licznik);
    this.pam.push(k);
}
PAM.prototype.inicjacja = function(){

    for(i=1;i<=32768;i++){
        this.dodajkom("0000",0);
    }
}
PAM.prototype.zapis = function(wartosc,pozycja){
    this.pam[this.generatorPoz(pozycja)].hex = wartosc;
}
PAM.prototype.generatorPoz = function(wartosc){
    let poz = Math.round(wartosc/16);
    return poz;
}
PAM.prototype.odczyt = function(kierunek,pozycja){
    document.getElementById(kierunek).value = this.pam[this.generatorPoz(pozycja)].hex;
    return true;
}

function STOS(){
    this.DOMobj = document.getElementById("stos");
    this.licznik = 0;
    this.max_kom = 32767;
    this.wskaznik_w_stosu= document.getElementById("sp");
    //this.przekroczenie = 0;
    this.pam = [];
    this.wsnum = new Number(0);
}
function SKOM(wartosc, pozycja, id){
    this.hex = wartosc;
    this.poz = pozycja;
    this.id = id;
    this.dlugosc = 2;
    this.DOMobj = document.createElement("div");
    this.DOMobj.setAttribute("id",this.id);
    this.DOMobj.setAttribute("class","k");
    this.DOMobj.classList.add("k1_rev");
    this.DOMobj.textContent = this.wartosc;
}

STOS.prototype.push = function(what){
    let x = document.getElementById(what).value;
    let y = document.getElementById("wskaznik");
    this.dodajkom(x);
    if(this.max_kom > this.licznik){
        //sprawdzenie przekroczenia widocznosci stosu
        if(this.licznik > 25){
            this.DOMobj.children[this.licznik-26].style = "display:none";
        // this.przekroczenie+=1;
            this.pam[this.licznik].DOMobj.textContent = x;
            this.DOMobj.appendChild(this.pam[this.licznik].DOMobj);
            this.licznik = this.licznik + 1;
            console.log("Ukrycie komurki stosu o id = s"+(this.licznik-27))
            console.log("Ukazywanie komurki stosu o id = s"+this.licznik)
            y.style = "height: calc(calc(100%/32767)*"+(this.licznik)+");";
            this.wsnum = new Number((((100/this.max_kom))*(this.licznik)));
            this.wsnum = this.wsnum.toFixed(2);
            this.wsnum = new Number(this.wsnum);
            y.textContent =  this.wsnum+"%";
        }
        else{
            this.pam[this.licznik].DOMobj.textContent = x;
            this.DOMobj.appendChild(this.pam[this.licznik].DOMobj);
            this.licznik = this.licznik + 1;
            console.log("Ukazywanie komurki stosu o id = s"+(this.licznik-1));
            y.style = "height: calc(calc(100%/32767)*"+(this.licznik)+");";
            this.wsnum = new Number((((100/this.max_kom))*(this.licznik)));
            this.wsnum = this.wsnum.toFixed(2);
            this.wsnum = new Number(this.wsnum);
            y.textContent =  this.wsnum+"%";;
        }
        this.wskaznik_w_stosu.value = emu.dekonverter(this.licznik*2);
    }
    else{
        console.log("STOS zapełniony!");
    }
}

STOS.prototype.dodajkom = function(hex){
    let s = new SKOM(hex,this.licznik,"s"+this.licznik);
    this.pam.push(s);
}
STOS.prototype.pop = function(where){
    let y = document.getElementById("wskaznik");
    if(this.licznik==0){
        console.log("Nie można usunąć komurki stosu która nie istenieje!");
    }
    else{
        if(this.licznik > 26){
            let x = document.getElementById(where);
            x.value = this.pam[this.licznik-1].hex;
            //this.DOMobj.children[this.licznik-27].remove("k1_rev");
            this.DOMobj.children[this.licznik-27].style = "display:block";
            this.DOMobj.removeChild(this.pam[this.licznik-1].DOMobj);
            this.pam.pop();
            console.log("Ukazywanie komurki stosu o id = s"+(this.licznik-27));
           // this.przekroczenie-=1;
            console.log("Uswuanie komurki stosu o id = s"+(this.licznik-1));
            this.licznik=this.licznik-1;
            y.style = "height: calc(calc(100%/32767)*"+(this.licznik)+");";
            this.wsnum = new Number((((100/this.max_kom))*(this.licznik)));
            this.wsnum = this.wsnum.toFixed(2);
            this.wsnum = new Number(this.wsnum);
            y.textContent =  this.wsnum+"%";
        }
        else{
            let x = document.getElementById(where);
            x.value = this.pam[this.licznik-1].hex;
            this.DOMobj.removeChild(this.pam[this.licznik-1].DOMobj);
            this.pam.pop();
            console.log("Uswuanie komurki stosu o id = s"+(this.licznik-1));
            this.licznik=this.licznik-1;
            y.style = "height: calc(calc(100%/32767)*"+(this.licznik)+");";
            this.wsnum = new Number((((100/this.max_kom))*(this.licznik)));
            this.wsnum = this.wsnum.toFixed(2);
            this.wsnum = new Number(this.wsnum);
            y.textContent =  this.wsnum+"%";
        }
    }
    this.wskaznik_w_stosu.value = emu.dekonverter(this.licznik*2 );
}