/*
 * autosave template session state
 * */
infra.seq={
	seldom:'·',
	offen:'.',
	short:function(val,offen,seldom){//Возвращает строку - короткая запись последовательности
		offen=offen||this.offen;
		seldom=seldom||this.seldom;
		if(typeof(val)=='string')return val;
		if(!val||typeof(val)!='object'||val.constructor!=Array)val=[];
		var nval=[];
		infra.forr(val,function(s){ 
			s=String(s);
			nval.push(s.replace(offen,seldom));
		});
		return nval.join(offen);
	},
	right:function(val,offen,seldom){//Возвращает массив - правильную запись последовательности
		offen=offen||this.offen;
		seldom=seldom||this.seldom;
		if(!val||typeof(val)!=='object'||val.constructor!==Array){
			if(typeof(val)!='string')val='';
			val=val.split(offen);
			infra.forr(val,function(s,i){
				val[i]=s.replace(seldom,offen);//Знак offen используется часто и должна быть возможность его указать в строке без специального смысла.. вот для этого и используется знак seldom 
			});
		}
		var res=[];
		infra.forr(val,function(s){//удаляются пустые
			if(s==='')return;
			res.push(s);//Знак offen используется часто и должна быть возможность его указать в строке без специального смысла.. вот для этого и используется знак seldom 
		});
		return res;
	},
	set:function(obj,right,val){
		var make=(typeof(val)=='undefined'||val===null?false:true);
		var i=right.length-1;
		if(i==-1)return val;
		if(make&&(!obj||typeof(obj)!=='object')&&typeof(obj)!=='function')obj={};
		var need=this.get(obj,right,0,i,make);
		if(!make&&(need&&typeof(need)=='object'))delete need[right[i]];
		if(make)need[right[i]]=val;
		return obj;
	},
	get:function(obj,right,start,end,make){//получить из obj значение right до end брать начинаем с start
		if(typeof(start)==='undefined')start=0;
		if(typeof(end)==='undefined')end=right.length;
		if(end===start)return obj;
		if(obj===undefined)return;

		if(make&&((!obj[right[start]]||typeof(obj[right[start]])!=='object')&&typeof(obj[right[start]])!=='function'))obj[right[start]]={};
		if((obj&&typeof(obj)=='object')||typeof(obj)=='function'){
			if(((obj===location||(!obj.hasOwnProperty))&&obj[right[start]])||obj.hasOwnProperty(right[start])){
				//в ie у location есть свойство hasOwnProperty но все свойства не являются собственными у location. в ff у location нет метода hasOwnProperty
				return this.get(obj[right[start]],right,++start,end,make);
			}
		}
	}
}