if(typeof(ROOT)=='undefined')var ROOT='../../../';//при eval должен остаться ROOT родителя при require ROOT родителя не должен быть виден.
if(typeof(infra)=='undefined')require(ROOT+'infra/plugins/infra/infra.js');
infra.load('*session/session.js','r');
this.init=function(){
	var view=infra.View.init(arguments);

	var REQ=view.getREQUEST();



	
	var ans={};

	if(!REQ.type)return view.end(ans,'Не указано имя сессии');

	ans.type=REQ.type;
	var workses=infra.Session.init(REQ.type,view);
	
	if(!workses.opt.sync)return view.end(ans,'Сессия '+REQ.type+' не может быть синхронизированна');

	
	
	/*if(!REQ.empty&&workses.isEmpty()){
		ans['sentall']=1;//На сервере удалена папка или что-то не так сессия пустая
		return view.end(ans);
		//Первое обращение с пустой сессии может быть на сервере и только потом прошла синхронизация и сессия уже не пуста хотя данные клиента в ней нет
	}*/

	
	var sesadm=infra.load('*session/sesadm.sjs');
	REQ.list=infra.exec(REQ.list,'в sync.njs');
	//if(!REQ.list)REQ.list=[];
	var file='*session/session_'+REQ.type+'.sjs';
	var file=infra.theme(file);
	if(file){
		var check=infra.load(file,'r');
		var resdata=workses.make([workses.storageLoad(),REQ.list]);
		check.before(REQ.list,resdata,workses,ans);
	}


	var news=[];

	var timename=workses.getName('time');
	var lasttime=Number(view.getCOOKIE(timename)||0);
	ans.lasttime=lasttime;
	var time=workses.getUnickTime();//Момент до которого нужно будет взять обновления и до которого можно ещё что-то записывать, всё что запишется после этой строки будет взято при следующей синхронизации
	ans.time=time;
	
	workses.data=workses.make(REQ.list,workses.data);//Устанавливать должны до того как считали что нового.. можно принять какое-нибудь старое значение
	workses.storageSave(REQ.list);
	//ans['serverses']=workses.get();
	var sernew=sesadm.loadNew(workses.type,workses.getId(),lasttime,time);
	//ans.sernew=sernew;
	news=news.concat(sernew);
	ans.news=news;
	
	
	//Всё что есть в текущей секунде мы забирать не можем.. берётся всё исключая последнюю секунду.. так как она ещё не закончилась и в ней только что были установлены данные. а первая секунда согласно REQ.time берётся полностью. Таким образом, только что установленное значение возьмётся как новое, при следующей синхронизации, но так как ничего на клиенте не изменится события не будет.. А если бы и были изменения, то о них пришла бы сюда информация раньше и возврата к старому значению небудет.. так всё и замыкается.


//Захватывать нужно секунду последню.. Если захватывается первая то всегда, только что установленное значение будет возвращаться как новое и при двойном клике и асинхронной отправки у пользователя будет глюк, когда двойной клик приведёт к тому что второй клик заменится пришедшим с сервера новыми данными как старыми... то есть будем мигать.. потом снова придут после второго клика старые данные как новые и чекбокс вернётся обратно.

//При захвате последней минуты пользователь не получит данные установленные в тот же момент времени что и его только что пришедшине данные. Но при следующей синхронизации, например через минуту будет захват той старой последней минуты, как первой и данные давно им же установленные придут как новые. Тут преимущество только в меньшем "дребезжании" - если данные не менялись то пришедшие старые данные, как новые, событий не вызовут.. а если между синхронизациями человек что-то кликал на сервере эти изменения уже будут учтены... вероятность морганий будет только если человек изменяет одно и тут же второе и снова первое.. при отправки второго придёт как новое первое значение и заменит повторно установленное, но потом всё вернётся на свои места согласно последней установки.. просто вероятность морганий меньше но исключить это нельзя так как асинхронность и при этом мгновенная реакция на клик пользователя или скрипта.


	if(!workses.get('__verify__')&&!REQ.isempty){
		ans['sentall']=1;//Сессия ещё не разу не забиралась от клиента
	}


	view.end(ans);	
}
