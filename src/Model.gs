/*
 * @todo define MVC's model for google sheets.
 * @author Wei Ji c445dj544@gmail.com
 */
var ModelSheet = function()
{
  this.SheetId = "";
  this.SheetName = "";
  this.ColumnName = ["Id","Created_at","Updated_at"];
  
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
   * @param Integer Column
   * @param String Value
   */
  this.searchByColumn = function( Column, Value )
  {
    var Sheet = this.getSheet();
    var values = Sheet.getDataRange().getValues();
    
    var Rows = [];
    
    for (var row in values)
    {
      if( values[row][Column-1] == Value ) //make sure id is in the first column in your sheet
      {
        Rows.push( values[row] );
      }
    }
    if( Rows.lenght == 0 )
      return -1;
    else
      return Rows;
    
  }
  
  /*
   * @todo edit a cell that search by id and column
   * @param Integer Id
   * @param Integer Column
   * @param String Value
   */
  this.editById = function ( Id, Column, Value )
  {
    var Sheet = this.getSheet();
    var values = Sheet.getDataRange().getValues();
    
    for (var row in values)
    {
      if( values[row][0] == _Id ) //make sure id is in the first column in your sheet
      {
        var cell = sheet.getRange( row+1, Column );
        cell.setValue( Value );
        
        //update 
        var UpdateCell = sheet.getRange( row+1, 3 );
        var CurrentDate = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");   //Generate Date
        UpdateCell.setValue( CurrentDate );
        
        return 1;
      }
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
    var Data = {};
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
      
      Data[i] = row;
    }

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
    var Member = {};
    Member["Gmail"] = Gmail;
    
    var data = this.getSheet().getDataRange().getValues();;
    
    for (var i = 1; i < data.length; i++) 
    {
      if( Gmail == data [i][4])
      {
        Member["Name" ] = data [i][3];
        Member["Permission"] = 1;
        return Member;
      }
    }
    
    Member["Name"] = "Guest";
    Member["Permission"] = 0;
    return Member;
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
   * @var 
   */ 
  this.checkClient = function( Id ){
    var Data = this.find( Id );
    if( Data == -1 )
      return -1;
    
    var Package = {
        "Name":Data[3],
        "From":Data[4],
        "Phone":Data[5],
        "Email":Data[6],
        "Credit":Data[7]
      };
    
    return Package;
  }
  
  /*
   * @todo add a new client
   * @param HashArray ClientInfo
   */ 
  this.addClient = function( ClientInfo ){
    var Log = new ModelLog;
    var data = [];
    
    data.push( ClientInfo["Name"  ] );
    data.push( ClientInfo["From"  ] );
    data.push( ClientInfo["Phone" ] );
    data.push( ClientInfo["Email" ] );
    data.push( 0 );
    
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
   * @param String Operator
   * @var Array
   */ 
  this.add = function( Filaments, Operator ){
    var Log = new ModelLog();
    var IdOfFilaments = [];
    for( Filament in Filaments)
    {
      //Filament should be HashArray, and had material, weight, color, diameter, status, note
      var Package = [
        Filament["material" ],
        Filament["weight"   ],
        Filament["color"    ],
        Filament["diameter" ],
        Filament["status"   ],
        Filament["note"     ],
        Operator
      ];
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
    
    this.editById( Id, 8, Status )

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
    this.editById( Id, 5, Weight )
    
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
    for( var index in Data)
    {
      var Filament = Data[index];
      Filament["Id"] = index;
      Package.push( Filament );
    }
    return Package;
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
