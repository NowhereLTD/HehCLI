/**
 * The base argument parser for heh
 */
const { args } = Deno;

switch (args[0]) {
  case "help":
    printHelp(args);
    break;
  case "create":
    await createProject(args);
    break;
  case "run":
    await runProject(args);
    break;
  default:
    console.log("Error command '" + args[0] + "' not found!");
}


/**
 * printHelp - Print out the help command
 *
 * @param  {Array} args A list of user arguments
 */
function printHelp(args) {
  console.log("Heh 1.0");
  console.log("A javascript based web framework.\n");
  console.log("Documentation: https://github.com/NowhereLTD/Heh");
  console.log("Git: https://github.com/NowhereLTD/Heh\n\n");
  console.log("Usage");
  console.log("  ./heh [OPTIONS]\n\n");
  console.log("OPTIONS");
  console.table({
    "help": {"Description": "Print out this help"},
    "create [name]": {"Description": "Create a new project"},
    "run [name]": {"Description": "Run the project"}
  }, ["Description"]);
}


/**
 * createProject - Create a new project
 *
 * @param  {Array} args A list of user arguments
 */
async function createProject(args) {
  let name = "Heh";
  if(args[1] != null) {
    name = args[1];
  }
  console.log("Create a new project...");
  console.log("Download the core...");
  const cloneProcess = await Deno.run({ cmd: ["git", "clone", "https://github.com/NowhereLTD/HehCore.git", name] });
  await cloneProcess.status();
  console.log("Done.");
}


/**
 * runProject - Run a project
 *
 * @param  {Array} args A list of user arguments
 */
async function runProject(args) {
  let path = ".";
  if(args[1] != null) {
    path = path + "/" + args[1];
  }

  try {
    console.log("Import Server and Module Parser...");
    let ServerModule = await import(path + "/src/Server/Server.class.js");
    let ParserModule = await import(path + "/src/ModuleParser/ModuleParser.class.js");
    console.log("Init Server and ModuleParser...");
    let server = new ServerModule.Server();
    let moduleParser = new ParserModule.ModuleParser(server);
    await moduleParser.loadModulePath(Deno.cwd() + "/" + path + "/", "", true);
    await moduleParser.loadModulePath(Deno.cwd() + "/" + path + "/");
    console.log("Run Server...");
    await server.listen();
  } catch (e) {
    if (e instanceof TypeError) {
      console.log("Error: Cannot found project.");
      return;
    }
    throw e;
  }
}
