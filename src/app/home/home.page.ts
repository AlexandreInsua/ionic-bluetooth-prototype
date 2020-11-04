import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { Component } from '@angular/core';

import { PrintService } from '../services/print.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  bluetoothList: any = [];
  selectedPrinter: any;

  readerMode$: any;

  constructor(
    private nfc: NFC,
    private ndef: Ndef,
    private print: PrintService) { }

  ngOnInit() {
    this.listen();
    this.listPrinter();
  }

  listen() {
    console.log('Escuchando tarjetas ....');
    let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    this.readerMode$ = this.nfc.readerMode(flags).subscribe(
      tag => {
        let dataJson = { id: null };
        // console.log(JSON.stringify(tag)),
        alert(JSON.stringify(tag))
        alert(JSON.stringify(tag.id))
        // dataJson = JSON.stringify(tag);
        let ids = tag.id;
        alert(this.nfc.bytesToHexString(ids))

      },
      err => console.log('Error reading tag', err)
    )

  }


  //This will list all of your bluetooth devices
  listPrinter() {
    this.print.searchBluetoothPrinter()
      .then(resp => {
        //List of bluetooth device list
        this.bluetoothList = resp;
      });
  }

  //This will store selected bluetooth device mac address
  selectPrinter(macAddress) {
    //Selected printer macAddress stored here
    this.selectedPrinter = macAddress;
  }

  //This will print
  printStuff() {
    //The text that you want to print
    // var myText = "Hello hello hello \n\n\n This is a test \n\n\n";
    let name = "Saec Analytics";
    let address1 = "Gran Via, 94";
    let address2 = "36203 VIGO";

    let myText =
      `
    ^XA
    ^FO50,50^ADN,36,20^FD${name}
    ^FS
    ^FO50,100^ADN,18,10^FD${address1}
    ^FS
    ^FO50,150^ADN,18,10^FD${address2}
    ^FS
    ^XZ
    `;

    this.print.sendToBluetoothPrinter(this.selectedPrinter, myText);
  }
}

