export interface IClaim {
  tx: String;
  projectTx: String;
  did: String;
  created: Date;
  location:{ 
    longitude: Number,
    latitude: Number
  }

}