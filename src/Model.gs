/*
 * @todo define MVC's model for google sheets.
 * @author Wei Ji c445dj544@gmail.com
 */
var ModelSheet = function()
{
  this.SheetId = "";
  this.SheetName = "";
  
  /*
  * @todo get sheet
  * @var Sheet
  */
  this.getSheet = function(){
    return SpreadsheetApp
      .openById( this.SheetId )
      .getSheetByName( this.SheetName );  
  }
  
  /*
   * @todo get values
   * @var Object[][]
   */ 
  this.getValues = function(){
    var Sheet = this.getSheet();
    return Sheet.getDataRange().getValues();
  }
  
  /*
   * @todo search row by id
   * @param Integer _Id
   * @var HashArray
   */
  this.find = function( _Id )
  {
    var Values = this.getValues();
    
    var ColumnNames = [];
    
    //initial name of column 
    for each ( var col in Values[0] )
      ColumnNames.push( col );
    
    for each(var Row in Values)
    {
      if( Row[0] == _Id ) //make sure id is in the first column in your sheet
      {
        var RowData = {};
        for ( var i in Row )
          RowData[ ColumnNames[i] ] = Row[i];

        return RowData;
      }
    }
    return -1;
  }
  
  /*
   * @todo search rows by ids
   * @param Array Ids
   * @var Array
   */
  this.searchByIds = function( Ids ){
    var Values  = this.getValues();
    var ToDoIds = Ids.slice();    //copy to new memory
    var ColumnNames = [];         //name of columns
    var Rows = [];                //the data of prepare to return
    
    //initial name of column 
    for each ( var col in Values[0] )
      ColumnNames.push( col );
    
    for each( var Row in Values )
      for( var i in ToDoIds )
      {
        if( Row[0] != ToDoIds[i]  )
          continue;
        
        //make a hasharray of row
        var RowData = {};
        for ( var j in Row )
          RowData[ ColumnNames[j] ] = Row[j];
        
        Rows.push( RowData );
        
        TodoIds.splice( i, 1 );   //remove the Id from Ids
      }
    
    if( Rows.lenght == 0 )        //there are no data match, return -1
      return -1;
    return Rows;
  }
  
  /*
   * @todo add a row to sheet
   * @param HashArray Data
   * @var Number
   */
  this.addData = function( Data )
  {
    var Sheet = this.getSheet();    //get sheet of database
    var Values = this.getValues();
    var ColumnNames = [];         //name of columns
    var NewId = Sheet.getLastRow();    //Generate ID
    
    
    //initial name of column 
    for each ( var col in Values[0] )
      ColumnNames.push( col );

    var CurrentDate = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");   //Generate Date
    var DataArray = [ NewId,CurrentDate,CurrentDate ];
    
    for( var i=3; i<ColumnNames.lenght; i++ )
    {
      if( !( ColumnNames[i] in Data ) )
      {
        DataArray.push("");
        continue;
      }
      DataArray.push( Data[ ColumnNames[i] ] );
    }
    
    Sheet.appendRow( DataArray );
    return ID;
  }
  

  
  /*
   * @todo search rows by value from certain column
   * @param String Column
   * @param String Value
   * @var Array
   */
  this.searchByColumn = function( Column, Value )
  {
    var Values  = this.getValues();
    var ColumnNames = [];         //name of columns
    var Rows = [];                //the data of prepare to return
    
    //initial name of column 
    for each ( var col in Values[0] )
      ColumnNames.push( col );
      
    if( !ColumnNames.includes( Column ) ) //there are not column named this
      return -1;
    
    var ColumnIndex = ColumnNames.indexOf( Column );  //get columnof index which user want to search
    for each( var Row in Values )
    {
      if( Row[ColumnIndex] != Value ) //not match, next one~
        continue;
        
      //make a HashArray of row
      var RowData = {};
      for ( var j in Row )
        RowData[ ColumnNames[j] ] = Row[j];
        
      Rows.push( RowData );
    }
    
    if( Rows.lenght == 0 )        //there are no data match, return -1
      return -1;
    return Rows;
  }
  
  /*
   * @todo edit a cell that search by id and column
   * @param Integer Id
   * @param String Column
   * @param String Value
   */
  this.editById = function ( Id, Column, Value )
  {
    var Sheet = this.getSheet();
    var Values  = this.getValues();
    var ColumnNames = [];         //name of columns
    
    //initial name of column 
    for each ( var col in Values[0] )
      ColumnNames.push( col );
      
    if( !ColumnNames.includes( Column ) ) //there are not column named this
      return -1;
    
    var ColumnIndex = ColumnNames.indexOf( Column );  //get columnof index which user want to edit
    
    for ( var RowIndex in Values )
      if( Values[RowIndex][0] == Id )
      {
        var TheCell = Sheet.getRange( RowIndex +1 , ColumnIndex +1 );
        TheCell.setValue( Value );
        
        //update 
        var UpdateCell = Sheet.getRange( RowIndex +1, 3 );
        var CurrentDate = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");   //Generate Date
        UpdateCell.setValue( CurrentDate );
        
        return 1;
      }
    
    return -1;
  }
  
  /*
   * @todo get whole data
   * @var HashArray
   */ 
  this.getAll = function(){
    var Sheet = this.getSheet();
    var values = Sheet.getDataRange().getValues();
    var Data = [];
    var ColumnNames = [];
    
    //initial name of column 
    for (var k = 0; k < values[0].length; k++) 
      ColumnNames.push(values[0][k]);
    
    for (var i = 1; i < values.length; i++) 
    {
      var row = {};      
      for (var j = 0; j < values[i].length; j++) 
      {
        row[ ColumnNames[j] ] = values[i][j];
      }
      
      Data.push( row );
    }
    
    if( Data.lenght == 0 )        //there are no data match, return -1
      return -1;

    return Data;
  }
}


/*
** @todo Model of Crew
*/
var ModelCrew = function(){
  //Initialize Model
  ModelSheet.call(this);
  this.SheetId  = getSheetInfo( "Crew", "ID" );
  this.SheetName = getSheetInfo( "Crew", "Name" );
  
  /*
  * @todo Checking user is one of team members.
  * @var HashArray
  */
  this.getIdentity = function(){
    var Gmail = Session.getActiveUser().getEmail();
    var Person = {};          //the HashArray which will be return
    Person["Gmail"] = Gmail;
    
    var Data = this.getAll();
    
    for each( Row in Data)
    {
      if( Gmail == Row["gmail"] )
      {
        Person["Name"] = Row["gmail"];
        Person["Permission"] = 1;
        return Person;
      }
    }
    Person["Name"] = "Guest";
    Person["Permission"] = 0;
    return Person;
  }
};

/*
** @todo Model of Client
*/
var ModelClient = function(){
  //Initialize Model
  ModelSheet.call(this);
  this.SheetId  = getSheetInfo( "Client", "ID" );
  this.SheetName = getSheetInfo( "Client", "Name" );
  
  /*
   * @todo check client exit
   * @param integer Id
   * @var HashArray
   */ 
  this.checkClient = function( Id ){
    var Data = this.find( Id );
    if( Data == -1 )
      return -1;
    
    var Package = {};
    
    Package["Name"] = Data["name"];
    Package["From"] = Data["from"];
    Package["Phone"] = Data["phone"];
    Package["Email"] = Data["email"];
    Package["Credit"] = Data["credit"];
    
    return Package;
  }
  
  /*
   * @todo add a new client
   * @param HashArray ClientInfo
   */ 
  this.addClient = function( ClientInfo ){
    var Log = new ModelLog;
    var Data = {};
    
    Data["name"]    = ClientInfo["Name"];
    Data["from"]    = ClientInfo["From"];
    Data["phone"]   = ClientInfo["Phone"];
    Data["email"]   = ClientInfo["Email"];
    Data["credit"]  = 0;
    
    this.addData( data );
    var str = "Add a new client(" + ClientInfo["Name"] +").";
    Log.add( str );
  }
}

/*
** @todo Model of Filament
*/
var ModelFilament = function(){
  //Initialize Model
  ModelSheet.call(this);
  this.SheetId  = getSheetInfo( "Filament", "ID" );
  this.SheetName = getSheetInfo( "Filament", "Name" );
  
  /*
   * @todo add a filament to the storage
   * @param Array Filaments
   * @var Array
   */ 
  this.add = function( Filaments ){
    var Gmail = Session.getActiveUser().getEmail();
    var Log = new ModelLog();
    var IdOfFilaments = [];
    for each( Filament in Filaments)
    {
      //Filament should be HashArray, and had material, weight, color, diameter, status, note
      var Package = {};
      
      Package["material"]   = Filament["material" ];
      Package["weight"]     = Filament["weight"];
      Package["color"]    = Filament["color"];
      Package["diameter"] = Filament["diameter"];
      Package["status"]   = Filament["status"];
      Package["note"]     = Filament["note"];
      Package["operator"] = Gmail;
      
      var Id = this.addData( Package );
      Log.add( "Add a filament of 3DP(" + Id + ")." );
      IdOfFilaments.push( Id );
    }
    return IdOfFilaments;
  }
  
  /*
   * @todo update status of filament in the storage
   * @param Integer Id
   * @param String Status
   */ 
  this.updateStatus = function( Id, Status ){
    var Log = new ModelLog();
    var Gmail = Session.getActiveUser().getEmail();
    
    this.editById( Id, "status", Status );
    this.editById( Id, "operator", Gmail );

    var str= "Change status of filament(" + Id + ").";
    Log.add( str );
  }
  
  /*
   * @todo update weight of filament in the storage
   * @param Integer Id
   * @param Integer Weight
   */ 
  this.uploadWeight = function( Idm Weight){
    var Log = new ModelLog();
    var Gmail = Session.getActiveUser().getEmail();
    
    this.editById( Id, "weight", Weight )
    this.editById( Id, "operator", Gmail );
    
    var str= "Change weight of filament(" + Id + ").";
    Log.add( str );
  }
  
  /*
   * @todo get whole the of filament from storage
   * @var Array
   */ 
  this.getStorage = function()
  {
    var Package = [];
    var Data = this.getAll();

    return Data;
  }
}

/*
** @todo Model of Deposit
*/
var ModelDeposit = function(){
  //Initialize Model
  ModelSheet.call(this);
  this.SheetId  = getSheetInfo( "Deposit", "ID" );
  this.SheetName = getSheetInfo( "Deposit", "Name" );
}

/*
** @todo Model of Depletion
*/
var ModelDepletion = function(){
  //Initialize Model
  ModelSheet.call(this);
  this.SheetId  = getSheetInfo( "Depletion", "ID" );
  this.SheetName = getSheetInfo( "Depletion", "Name" );
}

/*
** @todo Model of Log
*/
var ModelLog = function(){
  //Initialize Model
  ModelSheet.call(this);
  this.SheetId  = getSheetInfo( "Log", "ID" );
  this.SheetName = getSheetInfo( "Log", "Name" );
  
  /*
   * @todo add a log to database
   * @param String Message
   */
  this.add = function( Message ){
    var Gmail = Session.getActiveUser().getEmail();
    var data = [ Gmail, Message ];
    this.addData( data );
  }
}
