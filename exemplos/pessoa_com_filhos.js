// Exemplo de criação de classes com joosejs
//
// Este exemplo mostra como instanciar um objeto tipo "Adulto" que poder ter um array de filhos, e uma profissão.
//

Class('Pessoa',{
    has : { // as classes tem atributos e métodos... os atributos são definidos no 'has'
        //pq uma classe has um atributo.. has = tem
        //pessoa tem nome
        nome: { is: 'rw' },
        //pessoa tem sobrenome
        sobrenome : { is : 'rw' },
        idade: { is : 'rw' },
        profissao: { is : 'rw' }
    },
    methods : { 
        //e as classes tem metodos.. 
        //metodo dizer_nome
        dizer_nome : function () { 
            return "Meu nome é: " + this.nome;
        }, 
        //metodo dizer_sobrenome
        dizer_sobrenome : function () {
            return "meu sobrenome é " + this.sobrenome;
        }
    }
})

//essa é a estrutura basica do joose.
//agora pra instanciar a classe pessoa, eu posso passar o objeto (hash) direto pra instancia e ela vai jogar os valores nos atributos
//ex
var item = {
    nome: "joão",
    sobrenome: "da silva"// valeu
}; //agora da um run...

var p = new Pessoa( item );

//shjow, nao sabia rs. blz... então qual a facilidade disso ?? vamos supor que eu tenho um array de objetos pessoa..

var pessoas = [
    {
        nome: "joão",
        sobrenome: "silva",
    }, 
    {
        nome: "p2",
        sobrenome: "sp2"
    }
];

//fiz o request e veio um array de pessoas... agora eu preciso fazer um loop nesse array e criar as instancias de cada pessoa...

for ( var i=0,p; p=pessoas[i]; i++ ) {
    var person = new Pessoa(p);
    //alert( person.dizer_nome() + " e meu sobrenome é " + person.dizer_sobrenome() );
}



//esse é um excemplo de instancia.. agora vc viu que a classe pessoa tem dois atributos e dois metodos... 
//agora vou te mostrar a grande facilicade das roles..
//uma Role é um 'papel' que uma classe pode exercer... por exemplo, uma pessoa pode ter uma Role de "programador" que contem todas as regras de programador.
//e pessoa pode ter tambem alem de programador uma role "Pai" que contem todas as habuilidades de ser pai.
//entao eu posso definir elas assim:

Role("Pai", {
    has: {
        amor: { is : "rw"}
    },
    methods: {
        cuidar_dos_filhos : function () {
            return "estou cuidando dos meus filhos";
        }
    }
})

Class("Webmaster", {
    has : {
        profissao : { 
            is : 'ro', 
            init: ( function() { return "Programador Webmaster" } )()
        },
        linguagens : { 
            is : "rw" 
        }
    },
    methods: {
        programar: function () {
            return 'sou ' + this.profissao + ' e estou programando nas linguagens ' + this.linguagens;
        },
        executar : function () { 
            return this.programar();
        }
    }
})

Class("GerenteWebmaster", {
    has : {
        profissao : { 
            is : 'ro', 
            init: ( function() { return "Gerente de Webmasters" } )()
        },
        num_equipes: { 
            is: 'rw' 
        }
    },
    methods: {
        gerenciar: function () {
            return 'Sou ' + this.profissao + ' e vou gerenciar minhas equipes. Tenho um total de: ' + this.num_equipes + ' equipes.' ;
        },
        executar : function () { 
            return this.gerenciar();
        }
    }
})


Role("Brincar", {
    has : {
        brincadeiras_favoritas : { is : "rw" }
    },
    methods: {
        brincar : function () {
            return "sou criança.. vamos brincar de " + this.brincadeiras_favoritas;
        }
    }
})

//ahh
//Agora, eu crio uma outra classe que vai juntar Pessoa + Pai + Programador e criar uma nova classe que jutna elas todas. Primeiro eu vou alterar a Classe pessoa para Role 
//agora vou criar a classe pessoa que junta tudo isso

Class("Crianca", {
    isa: Pessoa,
    does: [Brincar],
    has : {
        ref_parent_class : { is : 'rw' }
    }
})

Type( "TipoCriancas" , {
    uses  : Joose.Type.Any,
    where : function ( array_de_filhos ) {
        console.log("Array de filhos:");
        console.log( array_de_filhos );
        if ( array_de_filhos == null ) return true; //se for nulo permite setar valor (eu simplesmente permiti uma excessão ao valor null)
        if ( array_de_filhos.length ) return false;
        console.log( "Erro... filhos tem que ser um array" );
        return null;
                           //se não for nulo pode ser qualquer coisa, string, objeto, etc. vai retornar false e
        //vai rodar as regras de coerce abaixo. As regras de coerce são opcionais e servem
        //para transformar um valor recebido no valor que desejado.
    },
    coerce : [ //coerce transforma o valor no que eu quero
        {
            from  : Joose.Type.Any,
            via   : function ( array_de_filhos ) {
                //transforma o array de filhos em instancia do tipo crianca
                var filhos = [];
                for ( var i=0, filho; filho=array_de_filhos[i]; i++ ) {
                    filhos.push( new Crianca( filho ) );
                }
                return filhos;
            }
        }
    ]
} )
  
Type( "TipoTrabalho" , {
    uses  : Joose.Type.Any,
    where : function ( trabalho ) {
        if ( trabalho == null ) return true;
        if ( trabalho ) return false;
        return null;
    },
    coerce : [
        {
            from  : Joose.Type.Any,
            via   : function ( trabalho ) {
                switch ( trabalho.profissao ) {
                    case "Webmaster":
                        return new Webmaster( trabalho );
                        break;
                    
                    case "GerenteWebmaster":
                        return new GerenteWebmaster( trabalho );
                        break;
                        
                    default:
                        return false;
                        break;
                }
            }
        }
    ]
} )
  

Class("Adulto", {
    isa: Pessoa,
    does: [Pai],
    has : {
        filhos : { 
              is : "rw",
             isa : Joose.Type.TipoCriancas,
          coerce : true,
        },
        trabalho : { 
              is : "rw",
             isa : Joose.Type.TipoTrabalho,
          coerce : true,
        }
    },
    after : { 
        setFilhos: function () { 
            for ( var i=0, filho; filho = this.filhos[i]; i++ ) {
                filho.setRef_parent_class( this );
            }
        }
    }
})


var adultos = [
    {
        amor: "muito amor",
        nome: "'Nome do primeiro pai'",
        sobrenome: "'Sobrenome do segundo pai'",
        trabalho: {
            profissao : "Webmaster",
            linguagens: "javascript, c++, haskel"
        },
        filhos: [
            {
                idade: 5,
                nome: "Filho1",
                sobrenome: "sobrenome_filho_1",
                brincadeiras_favoritas: "futebol, polícia e ladrão e jogar taco"
            },
            {
                idade: 10,
                nome: "Filho2",
                sobrenome: "sobrenome_filho_2",
                brincadeiras_favoritas: "esconde esconde, pega pega"
            }
        ]
    },
    {
        amor: "'mais ou menos'",
        nome: "'Nome segundo pai...'",
        sobrenome: "'sobrenome segundo pai...'",
        trabalho: {
            profissao : "GerenteWebmaster",
            num_equipes: 10
        },
        filhos: [
            {
                idade: 5,
                nome: "Filho1",
                sobrenome: "sobrenome_filho_1",
                brincadeiras_favoritas: "futebol, polícia e ladrão e jogar taco"
            },
        ]
    }
];

for ( var i=0, pessoa; pessoa = adultos[i]; i++ ) {
    var adulto1 = new Adulto( pessoa );
    alert( "Eu sou o adulto \n"+adulto1.dizer_nome()+"\n"+adulto1.trabalho.executar()  );
    for ( var f=0, filho; filho = adulto1.filhos[f]; f++ ) {
        alert( "sou o filho: " + filho.nome +" e minha idade é: " + filho.idade + "\n" + filho.brincar() + "\n e meu pai se chama: " + filho.ref_parent_class.nome );
    }
}
