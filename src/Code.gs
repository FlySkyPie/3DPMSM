/*
 * @todo define MVC's model for sheets.
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
   * @todo search rows by ids
   * @param Array Ids
   * @var Array
   */
  this.searchByIds = function( Ids ){
    var Sheet = this.getSheet();
    var values = Sheet.getDataRange().getValues();
    
    var TmpIds = Ids.slice();
    var Rows = [];
    
    for (var row in values)
    {
      for ( var i in TmpIds)
      {
        if( values[row][0] == TmpIds[i] ) //make sure id is in the first column in your sheet
        {
          Rows.push( values[row] );
          TmpIds.splice( i, 1 );
        }
      }
    }
    if( Rows.lenght == 0 )
      return -1;
    else
      return Rows;
  }
  
  /*
   * @todo add a row to sheet
   * @param Array Data
   * @var Number
   */
  this.addData = function( Data )
  {
    var Sheet = this.getSheet();    //get sheet of database
    var ID = Sheet.getLastRow();    //Generate ID
    var CurrentDate = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");   //Generate Date
    
    Data.unshift( CurrentDate );    //updated_at
    Data.unshift( CurrentDate );    //created_at
    Data.unshift( ID );             //id
    
    Sheet.appendRow( Data );
    return ID;
  }
  
  /*
   * @todo search row by id
   * @param Integer _Id
   * @var Array
   */
  this.find = function( _Id )
  {
    var Sheet = this.getSheet();
    var values = Sheet.getDataRange().getValues();
    
    for (var row in values)
    {
      if( values[row][0] == _Id ) //make sure id is in the first column in your sheet
      {
        var rowdata = [];
        for each( var value in values[row] )
        {
          rowdata.push( value );
        }

        return rowdata;
      }
    }
    return -1;
    
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
      if( values[row][Column] == Value ) //make sure id is in the first column in your sheet
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
  * @param String Gmail
  * @var HashArray
  */
  this.checkIdentity = function( Gmail ){
    var data = this.getSheet();
    for (var i = 1; i < data.length; i++) 
    {
      if( Gmail == data [i][1])
      {
        var Member = {};
        Member["Name"] = data [i][3];
        Member["Gmail"] = data [i][4];
        return Member;
      }
    }
    return false;
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
    var NumberOfFilaments = [];
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
      this.addData( Package );
      Log.add( Operator, "Add a filament of 3DP." );
    }
    return NumberOfFilaments;
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
   * @param String User
   * @param String Message
   */
  this.add = function( User, Message ){
    var data = [ User, Message ];
    this.addData( data );
  }
}

/*
 * Front-end stuff
 */ 
