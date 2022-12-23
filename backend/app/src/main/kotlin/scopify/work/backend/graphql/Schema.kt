package scopify.work.backend.graphql

import com.apurebase.kgraphql.schema.dsl.SchemaBuilder
import scopify.work.backend.infrastructure.RedisDal
import scopify.work.backend.model.ScopeGroup
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

    query("group") {
        description = "Gets a single group of scopes"
        resolver { id: String ->
            // Gets a group of scopes
            // TODO: Add a resolver that gets the scopes in that group
            sessionService.getScopeGroup(id)
        }
        type<ScopeGroup>() {
          property<List<ScopeSession>>("scopes") {
            resolver { group: ScopeGroup ->
              sessionService.getGroupScopes(group.id).map {
                sessionService.getById(it)
              }.filterNotNull()
            }
          }
        }
    }


    type<ScopeSession>()
    enum<ScopeState>()

    mutation("createGroup") {
        description = "Creates a new scope group"

        resolver { title: String ->
            // Creates a new group of scopes.

            sessionService.createScopeGroup(title)
        }
    }

    mutation("createSession") {
        description = "Creates a new session"

        resolver { title: String, description: String, group: String? ->
            sessionService.createSession(title, description, group)
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
