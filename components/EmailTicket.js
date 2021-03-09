export default function EmailTicket(props) {
    let index = 0;
    const ingressos = props.ticket.ingresso.map((ingresso) => 
        <div className="cardWrap">
            <div className="card cardLeft">
                <h1>COFAM <span>Teatro</span></h1>
                <div className="title">
                    <h2>UM CONTO QUE TE CONTAM</h2>
                    <span>PEÇA</span>
                </div>
                <div className="name">
                    <h2>Comunidade da Família</h2>
                    <span>por</span>
                </div>
                <div className="seat">
                    <h2>{ingresso}</h2>
                    <span>Cadeira</span>
                </div>
                <div className="time">
                    <h2>20:00</h2>
                    <span>Horas</span>
                </div>
            </div>
            <div className="card cardRight">
                <div className="eye" />
                <div className="number">
                    <img src={props.qrCodeTicket[index++]} alt="Ticket-QrCode" />
                </div>
            </div>
        </div>
    );

    return (
        <html>
            <head>
                <style dangerouslySetInnerHTML={{ __html: "\n.cardWrap {\nwidth: 27em;\nmargin: 3em auto;\ncolor: #fff;\nfont-family: sans-serif;\n}\n.card {\nbackground: linear-gradient(to bottom, #e8ce3d 0%, #e8ce3d 26%, #ecedef 26%, #ecedef 100%);\nheight: 13em;\nfloat: left;\nposition: relative;\npadding: 1em;\nmargin-top: 20px;\n}\n.cardLeft {\nborder-top-left-radius: 8px;\nborder-bottom-left-radius: 8px;\nwidth: 14em;\n}\n.cardRight {\nwidth: 8.5em;\nborder-left: 0.18em dashed #fff;\nborder-top-right-radius: 8px;\nborder-bottom-right-radius: 8px;\n}\n.cardRight:before, .cardRight:after {\ncontent: \"\";\nposition: absolute;\ndisplay: block;\nwidth: 0.9em;\nheight: 0.9em;\nbackground: #fff;\nborder-radius: 50%;\nleft: -0.5em;\n}\n.cardRight:before {\ntop: -0.4em;\n}\n.cardRight:after {\nbottom: -0.4em;\n}\nh1 {\nfont-size: 1.1em;\nmargin-top: 0;\n}\nh1 span {\nfont-weight: normal;\n}\n.title, .name, .seat, .time {\ntext-transform: uppercase;\nfont-weight: normal;\n}\n.title h2, .name h2, .seat h2, .time h2 {\nfont-size: 0.9em;\ncolor: #525252;\nmargin: 0;\n}\n.title span, .name span, .seat span, .time span {\nfont-size: 0.7em;\ncolor: #a2aeae;\n}\n.title {\nmargin: 2em 0 0 0;\n}\n.name, .seat {\nmargin: 0.7em 0 0 0;\n}\n.time {\nmargin: 0.7em 0 0 1em;\n}\n.seat, .time {\nfloat: left;\n}\n.eye {\nposition: relative;\nwidth: 2em;\nheight: 1.5em;\nmargin: 0 auto;\n}\n.number {\ntext-align: center;\ntext-transform: uppercase;\n}\n.number img {\ndisplay: block;\nmargin: 1em 0 0 0;\nfont-size: 2.5em;\ncolor: #a2aeae;\nwidth: 100%;\nheight: auto;\n}\n\n.barcode {\nheight: 2em;\nwidth: 0;\nmargin: 1.2em 0 0 0.8em;\n}" }} />
            </head>
            <body>
                {ingressos}
            </body>
        </html>
    );
}