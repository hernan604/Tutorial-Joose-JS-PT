;
  Class( "CalculadoraBase", {
    has : {
      resultado: { is : "rw", init: (function() { return 0 }) }
    },
    methods : {
      adicionar: function ( val1,val2 ) {
        this.setResultado( val1 + val2 );
        return this;
      },
      subtrair: function( val1,val2 ) {
        this.setResultado( val1 - val2 );
        return this;
      },
      multiplicar: function ( val1, val2 ) {
        this.setResultado( val1 * val2 );
        return this;
      },
      dividir: function( val1, val2 ) {
        this.setResultado( val1 / val2 );
        return this;
      },
      zerar: function( ) {
        this.setResultado( 0 );
        return this;
      }
    }
  } )

Role( "RaizQuadrada", {
  methods: {
    raiz_quadrada: function( val1 ) {
      this.setResultado(  Math.sqrt( val1 )  );
      return this;
    }
  }
} )

Role( "Potencia" , {
  methods: {
    elevar: function ( val1, val2 ) {
      this.setResultado( Math.pow( val1, val2 ) );
      return this;
    }
  }
} )

Role( "CalculadoraView", {
  has: {
    elem_calculadora: { is: 'rw' }, //referencia ao objeto jquery que aponta para a div calculadora
    elem_operacoes: { is: 'rw' }, //referencia ao objeto div_operacoes_realizadas
  },
  methods: {
    imprimir_resultado: function () {
      if ( ! this.elem_calculadora ) return;
      this.elem_calculadora.html( this.resultado );
    }
  },
  after: {
    setResultado: function () {
      this.imprimir_resultado();
    },
    adicionar_operacao: function( operacao ) {
      if ( ! this.elem_operacoes ) return;
      var li_operacao = jQuery( "<li>" );
      li_operacao.html( operacao.operacao + "|" );
      for ( var i in operacao.valores ) {
        li_operacao.append( operacao.valores[ i ] + " " );
      }
      li_operacao.append( " = " + operacao.resultado );

      this.elem_operacoes.append( li_operacao );
    }
  }
} )

Role( "RegistraOperacoes" , {
  has: {
    operacoes: { is: "rw", init: ( function () { return [] } )() }
  },
  methods: {
    registrar_operacao: function( operacao, val1, val2 ) {
      var operacao = {
        operacao : operacao,
        valores  : {},
        resultado: this.resultado
      };
      if ( typeof val1 != "undefined" ) //da pra usar Joose Types e
          operacao.valores.val1 = val1; //evitar validação desnecessária de types
      if ( typeof val2 != "undefined" )
          operacao.valores.val2 = val2;
      this.adicionar_operacao( operacao );
    },
    adicionar_operacao: function ( operacao ) {
      this.operacoes.push( operacao );
    }
  },
  after: {
    raiz_quadrada : function (val1 ) {
      this.registrar_operacao( "raiz_quadrada", val1 );
    },
    adicionar   : function( val1, val2 ) {
      this.registrar_operacao( "adicionar", val1, val2 );
    },
    subtrair    : function ( val1, val2 ) {
      this.registrar_operacao( "subtrair", val1, val2 );
    },
    multiplicar : function( val1, val2 ) {
      this.registrar_operacao( "multiplicar", val1, val2 );
    },
    dividir     : function( val1, val2 ) {
      this.registrar_operacao( "dividir", val1, val2 );
    },
  }
} )





Type( "ExemploNumerico" , {
  uses  : Joose.Type.Any,
  where : function ( val ) {
    if ( val == null ) return true; //se for nulo permite setar valor (eu simplesmente permiti uma excessão ao valor null)
    return false;                   //se não for nulo pode ser qualquer coisa, string, objeto, etc. vai retornar false e
                                    //vai rodar as regras de coerce abaixo. As regras de coerce são opcionais e servem
                                    //para transformar um valor recebido no valor que desejado.
  },
  coerce : [ //coerce transforma o valor no que eu quero
    {
      from  : Joose.Type.Any,
      via   : function ( val ) {
        var pattern_digits = /^(\d+)$/ig;
        if ( ! pattern_digits.test( val ) ) {
          return false;
        }
        return parseFloat( val );
      }
    }
  ]
} )

Type( "ExemploPeso" , {
  uses  : Joose.Type.Any,
  where : function ( val ) {
    if ( val == null ) return true;
    return false;
  },
  coerce : [ //coerce transforma o valor no que eu quero
    {
      from  : Joose.Type.Any,
      via   : function ( val ) {
        var pattern_float = /^(\d+)(\.\d+){0,1}$/ig;
        if ( ! pattern_float.test( val ) ) {
          return false;
        }
        return val + " kg";
      }
    }
  ]
} )

Type( "ExemploString", {
   uses : Joose.Type.Any,
  where : function ( val ) {
    if ( typeof val == "string" || val == null ) return true; //ta liberado pra setar nulo
    return false;
  },
  coerce: [
      //primeira regra
      {
        from : Joose.Type.Any,
         via : function ( val ) {
           console.log( Joose.Type.Any );
          if ( typeof val != "string" ) return false; //se tipo de val for string, beleza
          return val;
        }
      }
  ]
} )

Class( "Pessoa", {
  has : {
    nome : {
            is : "rw",
           isa : Joose.Type.ExemploString,
        coerce : true,
        getterName : "__setterNameCache",
    },
    sobrenome : {
            is : "rw",
           isa : Joose.Type.ExemploString,
        coerce : true,
    },
    idade : {
             is : "rw",
            isa : Joose.Type.ExemploNumerico,
         coerce : true,
    },
    peso : {
             is : "rw",
            isa : Joose.Type.ExemploPeso,
         coerce : true,
    },
  },
  methods : {
    andar : function () {
      //...
    }
  }
} )




