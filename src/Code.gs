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
 * @todo check account exist and how mant credit he/she have
 * @param HashArray Ask
 * @var String Name
 */ 
function checkAccount( Name )
{
  var Client = new ModelClient();
  var Data = Client.searchByColumn( 4, Name );
  
  if( Data == -1 )
    return -1;
    
  return JSON.stringify( Data[0] );
}
 
 
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
