import '../style/visual.less';


const AdvancedFilter = WynVisual.Models.Filter.AdvancedFilter;
const Enums = WynVisual.Enums;
const PLACEHOLDER = "input_placeholder";
const BUTTONBGCOLOR = "button_bgColor";
const BUTTONTEXT = "button_text";
const INPUTBGCOLOR = "input_bgColor";
const INPUTTEXT = "input_text";

export default class Visual extends WynVisual {

  private dom : HTMLElement;

  private inputEle : HTMLInputElement;
  // private btnEle : HTMLButtonElement;
  private host : VisualNS.VisualHost;
  
  private styleOption : any;
  private isMock : boolean;
  private filter : VisualNS.AdvancedFilter;

  private operator : any =Enums.AdvancedFilterOperator.Contains;
  private caseSensitive : boolean = false;
  
  private static root : Visual;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    Visual.root = this;
    this.dom = dom;
    this.host = host;
    Visual.root = this;
    dom.innerHTML = `
    
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="search" id="default-search" class="input-ele block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜索相关字段..." required>
        
    </div>
    `;

    const btnStr = `<button type="submit" class="btn-ele text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">搜索</button>`;
    this.inputEle = document.getElementsByClassName("input-ele")[0] as HTMLInputElement;
    // this.btnEle = document.getElementsByClassName("btn-ele")[0] as HTMLButtonElement;

    // this.btnEle.addEventListener('click',this.Submit);
    this.inputEle.addEventListener('blur',this.Submit);
    this.inputEle.addEventListener('keydown',
    function(event:KeyboardEvent){
      if(event.keyCode == 13){
      Visual.root.Submit(event);
      }
  })
  }
  private Submit = (e : Event)=>{
    let val = this.inputEle.value;
    if(this.isMock){
      return;
    }

    if(!val){
      this.host.filterService.clean();
      return 
    }else {
      this.filter.setConditions([{
        value: val,
        operator: (this.operator) || Enums.AdvancedFilterOperator.Contains,
        caseSensitive: this.caseSensitive,
      }]);
      this.host.filterService.applyFilter(this.filter);
    }
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dv = options.dataViews[0];
    this.styleOption = options.properties;
    this.applyStyleOption();

    if (dv && dv.plain) {
      const profile = dv.plain.profile.dimensions.values[0];
      const filter = new AdvancedFilter(profile);
      filter.fromJSON(options.filters[0] as VisualNS.IAdvancedFilter);
      this.filter = filter;
      this.isMock = false;
    } else {
      this.filter = null;
      this.isMock = true;
    }
  }

  public applyStyleOption = ()=>{
    let css = {};
    if(this.styleOption[PLACEHOLDER] != undefined){
      this.inputEle.placeholder = this.styleOption[PLACEHOLDER]||"";
    }
    /* if(this.styleOption[BUTTONBGCOLOR]){
      this.btnEle.style.backgroundColor = this.styleOption[BUTTONBGCOLOR];
    }
    if(this.styleOption[BUTTONTEXT]){
      this.btnEle.style.fontSize = this.styleOption[BUTTONTEXT].fontSize;
      this.btnEle.style.fontFamily = this.styleOption[BUTTONTEXT].fontFamily;
      this.btnEle.style.fontStyle = this.styleOption[BUTTONTEXT].fontStyle;
      this.btnEle.style.fontWeight = this.styleOption[BUTTONTEXT].fontWeight;
      this.btnEle.style.color = this.styleOption[BUTTONTEXT].color;
    } */
    if(this.styleOption[INPUTBGCOLOR]){
      this.inputEle.style.backgroundColor = this.styleOption[INPUTBGCOLOR];
    }
    if(this.styleOption[INPUTTEXT]){
      this.inputEle.style.fontSize = this.styleOption[INPUTTEXT].fontSize;
      this.inputEle.style.fontFamily = this.styleOption[INPUTTEXT].fontFamily;
      this.inputEle.style.fontStyle = this.styleOption[INPUTTEXT].fontStyle;
      this.inputEle.style.fontWeight = this.styleOption[INPUTTEXT].fontWeight;
      this.inputEle.style.color = this.styleOption[INPUTTEXT].color;
    }
    
  }


  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}