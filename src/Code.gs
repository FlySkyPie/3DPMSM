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
   * @todo get storage of filament
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

/**********************************************
 *             Front-end stuff
 **********************************************/ 
 
/*
** @todo website entry point
*/
function doGet( e ) 
{
  var Param = e.parameter;
  if( Param["page"] == "storage" )
  {
    return HtmlService
      .createTemplateFromFile('Storage')
      .evaluate();
  }
  else if( Param["page"] == "deposit" )
  {

  }
  else if( Param["page"] == "depletion" )
  {
  }

}

/*==========================================
 *               Storage Page
 *==========================================*/ 
/*
 * @todo get filament storage
 * @var StringOfJson
 */ 
function getFilament()
{
  var Filament = new ModelFilament();
  var Crew = new ModelCrew();
  var Package = {};
  Package["Filament"] = Filament.getStorage();
  Package["User"] = Crew.getIdentity();

  return JSON.stringify( Package );
}
/*
 * @todo modify status of filament to empty
 * @param Integer Id
 */ 
function setFilamentEmpty( Id )
{
  var Filament = new ModelFilament();
  Filament.updateStatus( Id, "已耗盡" );
  return "已經將線材 " + Id + " 號標記為「已耗盡」。";
}
 
/*
 * @todo modify status of filament to unpacking
 * @param Integer Id
 */ 
function setFilamentuUnpacking( Id )
{
  var Filament = new ModelFilament();
  Filament.updateStatus( Id, "已開封" );
  return "已經將線材 " + Id + " 號標記為「已開封」。";
}

/*
 * @todo modify weight of the filament
 */ 
function setFilamentWeight( Id, Weight )
{
  var Filament = new ModelFilament();
  Filament.updateWeight( Id, Weight );
  return "已經將線材 " + Id + " 號的重量更新為 " + Weight + " g。";
}

/*==========================================
 *              Deposit page
 *==========================================*/ 
/*
 * @todo deposit filament
 * @param HashArray Ask
 * @var Json
 */ 
function depositFilament( Ask )
{
  //check client exist? if not then create one
  
}




/*
 * @todo check account exist and how mant credit he/she have
 * @param HashArray Ask
 * @var Json
 */ 
function checkAccount( Ask )
{
  
  
}

/*
 * @todo add a order of 3D print
 * @param HashArray Ask
 * @var Json
 */ 
function addOrder( Ask )
{
  
  
}

/*
 * @todo include file from GAS
 * @param String Filename
 */
function include( Filename ) 
{
  return HtmlService.createHtmlOutputFromFile(Filename)
      .getContent();
}
