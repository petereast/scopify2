package scopify.work.backend.graphql

import com.apurebase.kgraphql.schema.dsl.SchemaBuilder
import scopify.work.backend.infrastructure.RedisDal
import scopify.work.backend.model.ScopeScore
import scopify.work.backend.model.ScopeSession
import scopify.work.backend.model.ScopeState
import scopify.work.backend.service.Scopify

fun SchemaBuilder.scopeSchema() {
    val sessionService = Scopify(RedisDal())

    query("session") {
        description = "Gets a single scoping session"
        resolver { id: String ->

            val session = sessionService.getById(id)
            println(session)

            session
        }
    }

    type<ScopeSession>()
    enum<ScopeState>()

    mutation("createSession") {
        description = "Creates a new session"

        resolver { title: String, description: String ->
            sessionService.createSession(title, description)
        }
    }

    mutation("submitScore") {
        description = "Submits a score to a soping session"

        resolver { sessionId: String, name: String, score: Int ->
            sessionService.addScope(sessionId, ScopeScore(name, score, null))
        }
    }

    mutation("finishSession") {
        description = "Ends a session. The session will no longer accept new scopes"
        resolver { sessionId: String -> sessionService.finishSession(sessionId) }
    }
}
