var infra = {};
this.infra = infra;

/* Константы, определяются клиентом и браузером отдельно. Приведены дефолтные значения. */
infra.ROOT = ''; // Корень сайта, от которого читается запрашиваемый путь
infra.NODE = false; // Находимся ли мы сейчас на node.js или в браузере
infra.DEBUG = false; // Вывод отладочной информации

/* Обработка ошибок */

/* Вывод ошибки */
infra.error = function(error, callback, name, context, args, msgs, test) {
	if (infra.DEBUG) {
		if(!callback) callback=''; if(!name) name='';
		if(!context) context=''; if(!args) args=''; if(!msgs) msgs=[];
		var em = 'Ошибка в '+name+'\n'+error.name+':'+error.message+'\ncallback:\n'+callback+'\nargs:\n'+args+'\ncontext:'+context+'\nИНФО:\n'+msgs.join('\n')
		if (!infra.NODE) {
			if (!test) alert(em);
		} else {
			if (!test) console.error(em);
		}
		throw error;
	}
}

/* Запуск функции, в которой может быть ошибка */
infra.exec = function(callback, name, context, args, msgs, test) {
	args=args||[];
	try {
		var r=callback.apply(context,args);
		return r;
	} catch(e) {
		infra.error(e, callback, name, context, args, msgs, test)
	}
}

/* Циклы */
/*
	fory - Бежим рекурсивно по массиву объектов, а потом по свойствам объектов y - Oo
	forx - Бежим по объекту а потом по его свойствам как по массивам рекурсивно x - multi
	
	fori - Бежим по объекту рекурсивно - for (var i 
	fora - Бежим по массиву рекурсивно (for Array)
	
	foru - Бежим без разницы объекту или массиву нерекурсивно
	
	//Низкий уровень
	foro - Бежим по объекту (for Object)
	forr - Бежим по массиву (for aRRay)
	
	val,key,group,i
	
	undefined везде пропускается, любой return обрывает цикл
*/
infra.foroa=function(){//depricated
	return infra.forx.apply(this,arguments);
}
infra.fory=function(obj,callback,back){
	return infra.fora(obj,function(v,i){
		return infra.foro(v,function(el,key,group){
			return infra.exec(callback,'infra.fory',this,[el,key,group,i],['back:'+back]);
		},back);
	},back);
}
infra.forx=function(obj,callback,back){//Бежим сначало по объекту а потом по его свойствам как по массивам
	return infra.foro(obj,function(v,key){
		return infra.fora(v,function(el,i,group){
			return infra.exec(callback,'infra.forx',this,[el,key,group,i],[back]);//callback,name,context,args,more
		},back);
	},back);
}
infra.foru=function(obj,callback,back){//Бежим без разницы объекту или массиву
	if(obj&&typeof(obj)=='object'&&obj.constructor==Array){
		return infra.forr(obj,callback,back);//Массив
	}else{
		return infra.foro(obj,callback,back);//Объект
	}
}

infra.fori=function(obj,callback,back,key,group){//Бежим по объекту рекурсивно
	var r,i;
	if(obj&&typeof(obj)=='object'){
		r=infra.foro(obj,function(v,key){
			r=infra.fori(v,callback,back,key,obj)
			if(r!==undefined)return r;
		},back);
		if(r!==undefined)return r;
	}else if(obj!==undefined){
		r=infra.exec(callback,'infra.fori',this,[obj,key,group],[back]);//callback,name,context,args,more
		if(r!==undefined)return r;
	}
}

infra.fora=function(el,callback,back,group,key){//Бежим по массиву рекурсивно
	var r,i;
	if(el&&el.constructor===Array){
		r=infra.forr(el,function(v,i){
			r=this.fora(v,callback,back,v,i);
			if(r!==undefined)return r;
		},back);
		if(r!==undefined)return r;
	}else if(el!==undefined){//Если undefined callback не вызывается, Таким образом можно безжать по переменной не проверя определена она или нет.
		r=infra.exec(callback,'infra.fora',this,[el,key,group],[back]);//callback,name,context,args,more
		if(r!==undefined)return r;
	}
}

infra.forr=function(el,callback,back){//Бежим по массиву
	if(!el)return;
	var r,i;
	if(back){
		for(i=el.length-1;i>=0;i--){
			r=infra.exec(callback,'infra.forr',this,[el[i],i],[back]);//callback,name,context,args,more
			if(r!==undefined)return r;
		}
	}else{
		for(i=0;i<el.length;i++){
			r=infra.exec(callback,'infra.forr',this,[el[i],i],[back]);//callback,name,context,args,more
			if(r!==undefined)return r;
		}
	}
}
infra.foro=function(obj,callback,back){//Бежим по объекту
	if(!obj)return;
	var r,ar=[],key,el,fn=back?'pop':'shift';
	for(key in obj){
		if(obj.hasOwnProperty(key))ar.push({key:key,val:obj[key]});
	}
	while(el=ar[fn]()){
		r=infra.exec(callback,'infra.foro',this,[el.val,el.key],[back]);//callback,name,context,args,more
		if(r!==undefined)return r;
	}
}

infra.each=function(elem,callback,back,group,key){//Возвращает undefined или то что было возвращено callback
	var r;//depricated
	if(elem&&elem.constructor===Array){
		if(back){
			for(var i=elem.length-1;i>=0;i--){
				r=this.each(elem[i],callback,back,elem,i);
				if(r!==true)return r;
			}
		}else{
			for(var i=0;i<elem.length;i++){
				r=this.each(elem[i],callback,back,elem,i);
				if(r!==true)return r;
			}
		}
	}else if(elem!==undefined){//Если undefined callback не вызывается, Таким образом можно безжать по переменной не проверя определена она или нет.
		try{
			r=callback.apply(this,[elem,group,key]);
			if(r!==undefined)return r;
		}catch(e){
			if(infra.debug)alert('Ошибка в infra.each\n'+e+'\nelem:\n'+elem+'\ncallback:\n'+callback+'\nback:\n'+back);
			throw e;
		}
	}
	return true;
}

/* Одинаковое api для загрузки слоев и расширений. */
infra.buffer=[];
infra.buffer_load=[];
infra.bufferOn=function(){
	infra.buff=true;
}
infra.bufferAdd=function(type,path){
	infra.buffer.push({type:type,path:path,toString:function(){return path}});
	infra.buffer_load.push(path);
}
infra.bufferOff=function(){
	infra.buff=false;
	infra.loadMulti(infra.buffer_load);
	infra.buffer_load=[];
	infra.forr(infra.buffer,function eachbuffer(o){
		try{
			infra[o.type](o.path);
		}catch(e){
			if(infra.debug)alert('Ошибка infra.bufferOff\n'+o.type+' '+o.path+'\n'+e);
		}
	});
}
infra.prop=function(obj,prop,def){//Считываем из obj prop если нет вернётся def
	/*
		var p='asdf';
		prop={'have':1}[p];

		- Считывание в переменную с именем аргумента функции (var не важен)
		- неизвестного свойства объекта (об этом появляется notice в Консоли ошибок)
		- имя свойства указано в переменной
		0.003ms против 2.5ms
	*/
	if(!obj)return def;
	if(obj.hasOwnProperty(prop))return obj[prop];
	return def;
}
infra.replacepath=function(oldp,newp){//понадобилось для переноса core/lib/session/session.js в core/plugins/session/session.js (*session/session.js)
	var self=infra.replacepath;
	if(newp){
		self[oldp]=newp;
	}else{
		newp=infra.prop(self,oldp,oldp);//Считываем из self oldp если нет будет oldp 
	}
	return newp;
}
infra.theme=function(src){
	if(/^\*+/.test(src)){//Начинаемся со звёздочки... значит настоящий путь надо вычислить этим занимается файл theme.php
		//src=src.replace(/^\*+/,'*');//Оставляем одну звёздочку
		//src='core/infra/theme.php?'+encodeURIComponent(src);//Это нужно когда путь до php с несколькоими параметрами * передаётся через theme.php Без кодирования путь будет портится, так как автоматически этот путь второй раз кодироватьс яне будет, а надо бы.. 
		src=src.replace(/^\*+/,'infra/plugins/');//Оставляем одну звёздочку
		//src='core/infra/theme.php?'+src;
	}else{
		//src=encodeURI(src);
		src=src;
	}
	return infra.ROOT+src;
}
infra.load=function(save_path,func,async) {//func и async deprecated
	if(infra.buff){
		infra.bufferAdd('load',save_path);
		return;
	}
	save_path=infra.replacepath(save_path);
	if(typeof(save_path)!=='string')return;
	if(async==undefined){
		async=!!func;
	}
	if(infra.load[save_path]!==undefined){
		if(func){
			func(infra.load[save_path]);
			return;
		}else{
			return infra.load[save_path];
		}
	}
	var load_path=this.theme(save_path);
	if (!infra.NODE) {
		//var exts = load_path.split('.')[-2];
		//&& (exts[0] != 'node') && ((exts[1] != 'js') || (exts[1] != 'json'))) {
		var transport = function(){
			var result = !1;
			var actions = [
				function() {return new XMLHttpRequest()},
				function() {return new ActiveXObject('Msxml2.XMLHTTP')},
				function() {return new ActiveXObject('Microsoft.XMLHTTP')}
			];
			for(var i = 0; i < actions.length; i++) {
				try{
					result = actions[i]();
					break;
				} catch (e) {}	
			}
			return result
		}
		transport.open('GET', load_path, async);
		transport.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
		if(async){
			transport.onreadystatechange=function(){
				var state = transport.readyState;
				if(state==4){
					if(transport.status == 200){
						infra.load[save_path]=transport.responseText;
					}else{
						infra.load[save_path]=null;
					}
					if(func)func(infra.load[save_path]);
				}
			}
		}
		transport.send(null);
		if(!async){
			if(transport.status == 200){
				infra.load[save_path]=transport.responseText;
			}else{
				infra.load[save_path]=null;
			}
			if(func)func(infra.load[save_path]);
			return infra.load[save_path];
		}
	} else {
		var fs = require('fs');
		try {
			infra.load[save_path] = fs.readFileSync(load_path, 'utf-8');
		} catch (e) {}
		return infra.load[save_path];
	}
}

/* События */

/* Подключение контролера (check) */

/* Загрузка расширений, могут быть разные для браузера и для клиента */
